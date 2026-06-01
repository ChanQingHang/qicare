'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLang } from '@/lib/i18n'
import { useStore } from '@/lib/store'

const SectionReveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.08 })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

const SPECS_ZH = ['内科 · 脾胃调理', '妇科 · 调经养颜', '针灸推拿', '儿科', '骨伤科', '其他']
const SPECS_EN = ['Internal · Spleen & Stomach', "Women's Health", 'Acupuncture & Tuina', 'Paediatrics', 'Orthopaedics', 'Others']

export default function Recruit() {
  const { t, lang } = useLang()
  const showToast = useStore((s) => s.showToast)

  const [form, setForm] = useState({
    name: '',
    phone: '',
    speciality: '',
    experience: '',
    bio: '',
    registration_no: '',
  })
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const set = (k: string, v: string) => {
    setForm((f) => ({ ...f, [k]: v }))
    setErrors((e) => ({ ...e, [k]: false }))
  }

  const validate = () => {
    const required = ['name', 'phone', 'experience', 'registration_no']
    const newErrors: Record<string, boolean> = {}
    required.forEach((k) => { if (!form[k as keyof typeof form].trim()) newErrors[k] = true })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const submit = async () => {
    if (!validate()) { showToast(t.recruit.required); return }
    setSubmitting(true)
    try {
      await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, experience: parseInt(form.experience) }),
      })
      setSuccess(true)
    } catch {
      showToast(t.recruit.submitError)
    } finally {
      setSubmitting(false)
    }
  }

  const reset = () => {
    setSuccess(false)
    setForm({ name: '', phone: '', speciality: '', experience: '', bio: '', registration_no: '' })
    setErrors({})
  }

  const steps = [
    { title: t.recruit.step1, time: t.recruit.step1t },
    { title: t.recruit.step2, time: t.recruit.step2t },
    { title: t.recruit.step3, time: t.recruit.step3t },
    { title: t.recruit.step4, time: t.recruit.step4t },
    { title: t.recruit.step5, time: t.recruit.step5t },
  ]

  const reqs = [t.recruit.req1, t.recruit.req2, t.recruit.req3, t.recruit.req4, t.recruit.req5]
  const perks = [t.recruit.perk1, t.recruit.perk2, t.recruit.perk3, t.recruit.perk4]
  const specs = lang === 'zh' ? SPECS_ZH : SPECS_EN

  const Field = ({
    id,
    label,
    children,
  }: {
    id: string
    label: string
    children: React.ReactNode
  }) => (
    <div className="mb-4">
      <label className="block text-[13px] text-ink-2 mb-1.5 font-medium">{label}</label>
      <div className={errors[id] ? 'ring-1 ring-red-400 rounded-xl' : ''}>{children}</div>
    </div>
  )

  const inputCls = `w-full border ${'' } border-cream-2 bg-white rounded-xl px-4 py-2.5 font-sans text-[14px] outline-none focus:border-sage transition-colors font-light`

  return (
    <section
      id="recruit"
      className="py-24 relative overflow-hidden"
      style={{ background: 'linear-gradient(165deg, #1F3A2E, #16302A)' }}
    >
      {/* Decorative elements */}
      <div
        className="absolute top-[-60px] right-[-60px] w-[300px] h-[300px] rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #C8A96A, transparent 70%)', filter: 'blur(60px)' }}
      />

      <div className="max-w-[1180px] mx-auto px-7">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Info */}
          <SectionReveal>
            <div className="inline-flex items-center gap-2 text-[12px] tracking-widest uppercase text-gold mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse-dot" />
              {t.recruit.eyebrow}
            </div>
            <h2 className="font-serif text-[clamp(28px,4vw,44px)] text-cream leading-tight mb-4">
              {t.recruit.title}
            </h2>
            <p className="text-[16px] text-cream/70 font-light mb-7 max-w-[480px] leading-relaxed">
              {t.recruit.lead}
            </p>

            {/* Requirements */}
            <div className="text-[13.5px] text-gold tracking-wide font-medium mb-3 flex items-center gap-2">
              {t.recruit.reqTitle}
            </div>
            {reqs.map((r, i) => (
              <div key={i} className="flex gap-2.5 py-1.5 text-[14px] text-cream/85 font-light">
                <span className="text-sage-l flex-shrink-0 mt-0.5">✓</span>
                {r}
              </div>
            ))}

            {/* Steps */}
            <div className="text-[13.5px] text-gold tracking-wide font-medium mt-6 mb-3 flex items-center gap-2">
              {t.recruit.stepsTitle}
            </div>
            {steps.map((s, i) => (
              <div key={i} className="flex gap-3.5 py-2">
                <div className="w-7 h-7 rounded-full bg-gold/20 text-gold text-[13px] flex items-center justify-center font-serif font-semibold flex-shrink-0">
                  {i + 1}
                </div>
                <div>
                  <div className="text-[14px] text-cream font-medium">{s.title}</div>
                  <div className="text-[12px] text-cream/45">{s.time}</div>
                </div>
              </div>
            ))}

            {/* Perks */}
            <div className="flex flex-wrap gap-2 mt-6">
              {perks.map((p) => (
                <span
                  key={p}
                  className="bg-cream/8 border border-cream/16 rounded-full px-4 py-2 text-[12.5px] text-cream/80"
                >
                  {p}
                </span>
              ))}
            </div>
          </SectionReveal>

          {/* Right Form */}
          <SectionReveal delay={0.2}>
            <div className="bg-paper rounded-[26px] p-7">
              {!success ? (
                <>
                  <h3 className="font-serif text-[21px] text-ink mb-1">{t.recruit.formTitle}</h3>
                  <p className="text-[13px] text-mut mb-5">{t.recruit.formSub}</p>

                  <Field id="name" label={t.recruit.nameLabel}>
                    <input
                      className={inputCls}
                      placeholder={t.recruit.namePlaceholder}
                      value={form.name}
                      onChange={(e) => set('name', e.target.value)}
                    />
                  </Field>

                  <Field id="phone" label={t.recruit.phoneLabel}>
                    <input
                      className={inputCls}
                      placeholder={t.recruit.phonePlaceholder}
                      value={form.phone}
                      onChange={(e) => set('phone', e.target.value)}
                    />
                  </Field>

                  <Field id="speciality" label={t.recruit.specLabel}>
                    <select
                      className={inputCls}
                      value={form.speciality}
                      onChange={(e) => set('speciality', e.target.value)}
                    >
                      <option value="">—</option>
                      {specs.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </Field>

                  <div className="grid grid-cols-2 gap-4">
                    <Field id="experience" label={t.recruit.expLabel}>
                      <input
                        className={inputCls}
                        type="number"
                        placeholder={t.recruit.expPlaceholder}
                        value={form.experience}
                        onChange={(e) => set('experience', e.target.value)}
                      />
                    </Field>
                    <Field id="registration_no" label={t.recruit.regLabel}>
                      <input
                        className={inputCls}
                        placeholder={t.recruit.regPlaceholder}
                        value={form.registration_no}
                        onChange={(e) => set('registration_no', e.target.value)}
                      />
                    </Field>
                  </div>

                  <Field id="bio" label={t.recruit.bioLabel}>
                    <textarea
                      className={`${inputCls} resize-none`}
                      rows={3}
                      placeholder={t.recruit.bioPlaceholder}
                      value={form.bio}
                      onChange={(e) => set('bio', e.target.value)}
                    />
                  </Field>

                  <button
                    onClick={submit}
                    disabled={submitting}
                    className="w-full mt-1 bg-clay text-white text-[14px] rounded-full py-3.5 hover:brightness-105 transition-all font-medium disabled:opacity-60"
                  >
                    {submitting ? t.recruit.submitting : t.recruit.submitBtn}
                  </button>
                </>
              ) : (
                <div className="text-center py-8 animate-fadein">
                  <div className="w-16 h-16 rounded-full bg-sage text-white flex items-center justify-center text-[28px] mx-auto mb-4">
                    ✓
                  </div>
                  <h3 className="font-serif text-[22px] text-ink mb-2">{t.recruit.successTitle}</h3>
                  <p className="text-[14px] text-mut font-light max-w-[340px] mx-auto">{t.recruit.successMsg}</p>
                  <button
                    onClick={reset}
                    className="mt-5 border border-cream-2 text-ink-2 text-[13.5px] rounded-full px-6 py-2.5 hover:border-sage transition-colors"
                  >
                    {t.recruit.submitAgain}
                  </button>
                </div>
              )}
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  )
}
