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

// ⚠️ IMPORTANT: defined OUTSIDE of Recruit to keep a stable component reference.
// Defining it inside Recruit would create a new type on every render, causing React
// to unmount/remount inputs on every keystroke → inputs lose focus.
function FormField({
  label,
  error,
  children,
}: {
  label: string
  error?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="mb-4">
      <label className="block text-[13px] text-ink-2 mb-1.5 font-medium">{label}</label>
      <div className={error ? 'ring-1 ring-red-400 rounded-xl' : ''}>{children}</div>
    </div>
  )
}

const INPUT_CLS =
  'w-full border border-cream-2 bg-white rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-sage transition-colors font-light'

const SPECS_ZH = ['内科 · 脾胃调理', '妇科 · 调经养颜', '针灸推拿', '儿科', '骨伤科', '其他']
const SPECS_EN = ["Internal · Spleen & Stomach", "Women's Health", 'Acupuncture & Tuina', 'Paediatrics', 'Orthopaedics', 'Others']

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

  const setField = (k: keyof typeof form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: false }))
  }

  const validate = () => {
    const required: (keyof typeof form)[] = ['name', 'phone', 'experience', 'registration_no']
    const newErrors: Record<string, boolean> = {}
    required.forEach((k) => {
      if (!form[k].trim()) newErrors[k] = true
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const submit = async () => {
    if (!validate()) {
      showToast(t.recruit.required)
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          experience: parseInt(form.experience) || 0,
        }),
      })
      if (!res.ok) throw new Error('server error')
      showToast(t.recruit.successTitle)
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

  return (
    <section
      id="recruit"
      className="py-24 relative overflow-hidden"
      style={{ background: 'linear-gradient(165deg, #1B3A2D, #0f2218)' }}
    >
      <div
        className="absolute top-[-60px] right-[-60px] w-[320px] h-[320px] rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #52B788, transparent 70%)', filter: 'blur(70px)' }}
      />

      <div className="max-w-[1180px] mx-auto px-7">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left — Info */}
          <SectionReveal>
            <div className="inline-flex items-center gap-2 text-[12px] tracking-widest uppercase text-sage-l mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-sage-l animate-pulse-dot" />
              {t.recruit.eyebrow}
            </div>
            <h2 className="font-serif text-[clamp(28px,4vw,44px)] text-cream leading-tight mb-4">
              {t.recruit.title}
            </h2>
            <p className="text-[16px] text-cream/70 font-light mb-7 max-w-[480px] leading-relaxed">
              {t.recruit.lead}
            </p>

            <div className="text-[13px] text-sage-l font-medium mb-3">{t.recruit.reqTitle}</div>
            {reqs.map((r, i) => (
              <div key={i} className="flex gap-2.5 py-1.5 text-[13.5px] text-cream/80 font-light">
                <span className="text-sage flex-shrink-0 mt-0.5">✓</span>
                {r}
              </div>
            ))}

            <div className="text-[13px] text-sage-l font-medium mt-6 mb-3">{t.recruit.stepsTitle}</div>
            {steps.map((s, i) => (
              <div key={i} className="flex gap-3.5 py-2">
                <div className="w-7 h-7 rounded-full bg-sage/20 text-sage-l text-[12.5px] flex items-center justify-center font-serif font-semibold flex-shrink-0">
                  {i + 1}
                </div>
                <div>
                  <div className="text-[14px] text-cream font-medium">{s.title}</div>
                  <div className="text-[12px] text-cream/40">{s.time}</div>
                </div>
              </div>
            ))}

            <div className="flex flex-wrap gap-2 mt-6">
              {perks.map((p) => (
                <span
                  key={p}
                  className="bg-white/8 border border-white/14 rounded-full px-4 py-2 text-[12px] text-cream/75"
                >
                  {p}
                </span>
              ))}
            </div>
          </SectionReveal>

          {/* Right — Form */}
          <SectionReveal delay={0.2}>
            <div className="bg-paper rounded-[26px] p-7">
              {!success ? (
                <>
                  <h3 className="font-serif text-[21px] text-ink mb-1">{t.recruit.formTitle}</h3>
                  <p className="text-[13px] text-mut mb-5">{t.recruit.formSub}</p>

                  <FormField label={t.recruit.nameLabel} error={errors.name}>
                    <input
                      className={INPUT_CLS}
                      placeholder={t.recruit.namePlaceholder}
                      value={form.name}
                      onChange={(e) => setField('name', e.target.value)}
                    />
                  </FormField>

                  <FormField label={t.recruit.phoneLabel} error={errors.phone}>
                    <input
                      className={INPUT_CLS}
                      placeholder={t.recruit.phonePlaceholder}
                      value={form.phone}
                      onChange={(e) => setField('phone', e.target.value)}
                    />
                  </FormField>

                  <FormField label={t.recruit.specLabel}>
                    <select
                      className={INPUT_CLS}
                      value={form.speciality}
                      onChange={(e) => setField('speciality', e.target.value)}
                    >
                      <option value="">—</option>
                      {specs.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </FormField>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField label={t.recruit.expLabel} error={errors.experience}>
                      <input
                        className={INPUT_CLS}
                        type="number"
                        min="0"
                        placeholder={t.recruit.expPlaceholder}
                        value={form.experience}
                        onChange={(e) => setField('experience', e.target.value)}
                      />
                    </FormField>
                    <FormField label={t.recruit.regLabel} error={errors.registration_no}>
                      <input
                        className={INPUT_CLS}
                        placeholder={t.recruit.regPlaceholder}
                        value={form.registration_no}
                        onChange={(e) => setField('registration_no', e.target.value)}
                      />
                    </FormField>
                  </div>

                  <FormField label={t.recruit.bioLabel}>
                    <textarea
                      className={`${INPUT_CLS} resize-none`}
                      rows={3}
                      placeholder={t.recruit.bioPlaceholder}
                      value={form.bio}
                      onChange={(e) => setField('bio', e.target.value)}
                    />
                  </FormField>

                  <button
                    type="button"
                    onClick={submit}
                    disabled={submitting}
                    className="w-full mt-2 bg-ink-2 text-white text-[14px] rounded-full py-3.5 hover:bg-ink transition-all font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin-slow" />
                        {t.recruit.submitting}
                      </span>
                    ) : t.recruit.submitBtn}
                  </button>
                </>
              ) : (
                <div className="text-center py-8 animate-fadein">
                  <div className="w-16 h-16 rounded-full bg-sage text-white flex items-center justify-center text-[26px] mx-auto mb-4">
                    ✓
                  </div>
                  <h3 className="font-serif text-[22px] text-ink mb-2">{t.recruit.successTitle}</h3>
                  <p className="text-[14px] text-mut font-light max-w-[340px] mx-auto leading-relaxed">
                    {t.recruit.successMsg}
                  </p>
                  <button
                    onClick={reset}
                    className="mt-5 border border-cream-2 text-ink-2 text-[13px] rounded-full px-6 py-2.5 hover:border-sage transition-colors"
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
