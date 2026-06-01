'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLang } from '@/lib/i18n'
import { supabase, type CaseStudy } from '@/lib/supabase'

const SectionReveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })
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

const STATIC_CASES: CaseStudy[] = [
  {
    id: '1',
    category: '脾胃 · 内科',
    category_en: 'Spleen & Stomach',
    title: '反复胃胀两年，八周调理改善',
    title_en: 'Chronic Bloating for 2 Years — Resolved in 8 Weeks',
    description: '45岁男性，长期饭后腹胀、嗳气。辨证脾虚气滞，以健脾理气为法，配合饮食调整，八周后症状明显缓解。',
    description_en: 'Male, 45. Chronic post-meal bloating and belching. Diagnosed as Spleen Qi deficiency with Qi stagnation. Combined herbal formula with dietary guidance — significant relief after 8 weeks.',
    treatment_plan: ['辨证：脾虚气滞', '治法：健脾益气、理气和胃', '方向：香砂六君子加减', '配合：三餐定时、忌生冷'],
    treatment_plan_en: ['Pattern: Spleen Qi Deficiency with Qi Stagnation', 'Method: Tonify Spleen Qi, Regulate Stomach Qi', 'Formula: Xiang Sha Liu Jun Zi variation', 'Lifestyle: Regular meals, avoid cold foods'],
    image_url: 'https://images.unsplash.com/photo-1610847499832-918a1c3c6811?auto=format&fit=crop&w=600&q=70',
    doctor_name: '李明华',
  },
  {
    id: '2',
    category: '妇科 · 月经',
    category_en: "Women's Health",
    title: '月经不调伴手脚冰凉调理记',
    title_en: 'Irregular Periods & Cold Extremities — Regulated in 3 Cycles',
    description: '29岁女性，经期推迟、痛经、畏寒。辨证为宫寒血瘀，温经散寒为主，三个周期后经期趋于规律。',
    description_en: 'Female, 29. Delayed periods, dysmenorrhoea, cold intolerance. Pattern: Uterine Cold with Blood Stasis. Warming and blood-activating treatment — regulated within 3 menstrual cycles.',
    treatment_plan: ['辨证：宫寒血瘀', '治法：温经散寒、活血调经', '方向：温经汤加减', '配合：腹部保暖、忌生冷'],
    treatment_plan_en: ['Pattern: Uterine Cold with Blood Stasis', 'Method: Warm Channels, Activate Blood', 'Formula: Wen Jing Tang variation', 'Lifestyle: Warm abdomen, avoid cold'],
    image_url: 'https://images.unsplash.com/photo-1556760544-74068565f05c?auto=format&fit=crop&w=600&q=70',
    doctor_name: '陈雅芳',
  },
  {
    id: '3',
    category: '针灸 · 颈肩',
    category_en: 'Acupuncture',
    title: '久坐颈肩僵痛，针灸十次显效',
    title_en: 'Chronic Neck & Shoulder Pain — Cleared in 10 Acupuncture Sessions',
    description: '34岁上班族，长期颈肩酸痛、活动受限。以针灸配合推拿疏通经络，十次治疗后疼痛大幅减轻。',
    description_en: 'Office worker, 34. Chronic neck and shoulder tension, limited range of motion. Acupuncture combined with tuina massage — pain significantly reduced after 10 sessions.',
    treatment_plan: ['辨证：气滞血瘀、经络不通', '治法：针灸疏通、推拿松解', '疗程：每周2次，共十次', '配合：工间活动、热敷'],
    treatment_plan_en: ['Pattern: Qi & Blood Stagnation in Channels', 'Method: Acupuncture + Tuina Massage', 'Course: 2x/week, 10 sessions', 'Lifestyle: Regular breaks, heat therapy'],
    image_url: 'https://images.unsplash.com/photo-1542736667-069246bdbc6d?auto=format&fit=crop&w=600&q=70',
    doctor_name: '王志强',
  },
]

export default function Cases() {
  const { t, lang } = useLang()
  const [cases, setCases] = useState<CaseStudy[]>(STATIC_CASES)
  const [selected, setSelected] = useState<CaseStudy | null>(null)

  useEffect(() => {
    if (!supabase) return
    supabase
      .from('cases')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(6)
      .then(({ data }) => {
        if (data && data.length > 0) setCases(data as CaseStudy[])
      })
  }, [])

  return (
    <>
      <section id="cases" className="py-24 bg-ink">
        <div className="max-w-[1180px] mx-auto px-7">
          <SectionReveal>
            <div className="text-center max-w-[600px] mx-auto mb-14">
              <div className="inline-flex items-center gap-2 text-[12px] tracking-widest uppercase text-gold mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse-dot" />
                {t.cases.eyebrow}
              </div>
              <h2 className="font-serif text-[clamp(28px,4vw,44px)] text-gold">{t.cases.title}</h2>
              <p className="mt-4 text-[16px] text-cream/70 font-light">{t.cases.sub}</p>
            </div>
          </SectionReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {cases.map((c, i) => (
              <SectionReveal key={c.id} delay={i * 0.1}>
                <div
                  className="bg-cream/5 border border-cream/12 rounded-[22px] overflow-hidden cursor-pointer hover:bg-cream/9 hover:-translate-y-1 transition-all duration-300"
                  onClick={() => setSelected(c)}
                >
                  {/* Image */}
                  <div className="h-[180px] relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={c.image_url}
                      alt={lang === 'zh' ? c.title : c.title_en}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
                  </div>
                  <div className="p-5">
                    <div className="text-[12px] text-gold tracking-wide uppercase mb-2">
                      {lang === 'zh' ? c.category : c.category_en}
                    </div>
                    <h3 className="font-serif text-[17px] text-cream leading-snug mb-2">
                      {lang === 'zh' ? c.title : c.title_en}
                    </h3>
                    <p className="text-[13px] text-cream/65 font-light line-clamp-2">
                      {(lang === 'zh' ? c.description : c.description_en).slice(0, 60)}…
                    </p>
                    <div className="flex items-center gap-1.5 mt-4 text-[12.5px] text-gold">
                      {t.cases.readMore}
                    </div>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Case Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-ink/55 backdrop-blur-sm animate-fadein"
          onClick={(e) => e.target === e.currentTarget && setSelected(null)}
        >
          <div className="bg-paper rounded-[26px] w-full max-w-[560px] max-h-[88vh] overflow-y-auto p-8 relative shadow-modal animate-fadein">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-cream-2 flex items-center justify-center text-ink-2 text-[18px]"
            >
              ✕
            </button>

            <div className="h-[200px] rounded-2xl overflow-hidden mb-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selected.image_url} alt="" className="w-full h-full object-cover" />
            </div>

            <div className="text-[12px] text-clay tracking-wide uppercase mb-2">
              {lang === 'zh' ? selected.category : selected.category_en}
            </div>
            <h3 className="font-serif text-[22px] text-ink mb-3">
              {lang === 'zh' ? selected.title : selected.title_en}
            </h3>
            <p className="text-[14.5px] text-ink-2 font-light leading-relaxed mb-5">
              {lang === 'zh' ? selected.description : selected.description_en}
            </p>

            <div className="bg-cream-2 rounded-2xl p-5">
              <div className="font-medium text-ink mb-3 text-[15px]">{t.cases.treatTitle}</div>
              {(lang === 'zh' ? selected.treatment_plan : selected.treatment_plan_en).map((item, i) => (
                <div key={i} className="flex gap-2 py-1.5 text-[13.5px] text-ink-2">
                  <span className="text-sage flex-shrink-0">▸</span>
                  {item}
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setSelected(null)
                document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="w-full mt-5 bg-ink text-cream text-[14px] rounded-full py-3.5 hover:bg-ink-2 transition-colors"
            >
              {t.cases.closeCta}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
