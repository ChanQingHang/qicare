'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLang } from '@/lib/i18n'
import { useStore, type Product } from '@/lib/store'

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

const TRT_PRODUCTS: Product[] = [
  {
    id: 1,
    name: '安宫牛黄丸',
    nameEn: 'An Gong Niu Huang Wan',
    effect: '清热解毒 · 镇惊开窍，用于热病、神昏、中风痰迷',
    effectEn: 'Clears Heat · Calms the Mind · Stroke & High Fever Support',
    price: 398,
    gradient: 'linear-gradient(135deg, #D4A847 0%, #8B6914 100%)',
  },
  {
    id: 2,
    name: '六味地黄丸',
    nameEn: 'Liu Wei Di Huang Wan',
    effect: '滋阴补肾，用于肾阴亏损、头晕耳鸣、腰膝酸软',
    effectEn: 'Nourishes Kidney Yin · Dizziness · Low Back & Knee Weakness',
    price: 42,
    gradient: 'linear-gradient(135deg, #6B3A2A 0%, #3D1A0E 100%)',
  },
  {
    id: 3,
    name: '乌鸡白凤丸',
    nameEn: 'Wu Ji Bai Feng Wan',
    effect: '补气养血 · 调经止带，妇科调理经典',
    effectEn: "Tonifies Qi & Blood · Regulates Menstruation · Women's Classic",
    price: 56,
    gradient: 'linear-gradient(135deg, #4A2C5A 0%, #2A1435 100%)',
  },
  {
    id: 4,
    name: '牛黄解毒片',
    nameEn: 'Niu Huang Jie Du Pian',
    effect: '清热解毒，用于火热内盛、咽喉肿痛、牙龈肿痛',
    effectEn: 'Clears Heat & Toxins · Sore Throat · Toothache & Gum Pain',
    price: 22,
    gradient: 'linear-gradient(135deg, #C8A03C 0%, #8A6820 100%)',
  },
  {
    id: 5,
    name: '逍遥丸',
    nameEn: 'Xiao Yao Wan',
    effect: '疏肝健脾 · 养血调经，用于肝气不舒、胸胁胀痛',
    effectEn: 'Soothes Liver Qi · Strengthens Spleen · Chest Tightness & PMS',
    price: 38,
    gradient: 'linear-gradient(135deg, #5A8C5A 0%, #2E4E2E 100%)',
  },
  {
    id: 6,
    name: '补中益气丸',
    nameEn: 'Bu Zhong Yi Qi Wan',
    effect: '补中益气 · 升阳举陷，用于脾胃虚弱、中气下陷',
    effectEn: 'Tonifies Middle Qi · Raises Yang · Fatigue & Organ Prolapse',
    price: 42,
    gradient: 'linear-gradient(135deg, #C2A06A 0%, #8A6A3A 100%)',
  },
  {
    id: 7,
    name: '归脾丸',
    nameEn: 'Gui Pi Wan',
    effect: '益气健脾 · 养血安神，用于心脾两虚、失眠健忘',
    effectEn: 'Nourishes Heart & Spleen · Improves Sleep & Memory',
    price: 36,
    gradient: 'linear-gradient(135deg, #8C6A8A 0%, #4E3A4E 100%)',
  },
  {
    id: 8,
    name: '天王补心丹',
    nameEn: 'Tian Wang Bu Xin Dan',
    effect: '滋阴清热 · 养血安神，用于心阴不足、心悸失眠',
    effectEn: 'Nourishes Heart Yin · Calms Spirit · Palpitations & Insomnia',
    price: 58,
    gradient: 'linear-gradient(135deg, #2A4A6A 0%, #162535 100%)',
  },
  {
    id: 9,
    name: '金匮肾气丸',
    nameEn: 'Jin Kui Shen Qi Wan',
    effect: '温补肾阳，用于肾虚水肿、腰膝痠软、畏寒肢冷',
    effectEn: 'Warms Kidney Yang · Edema · Cold Limbs & Low Back Pain',
    price: 48,
    gradient: 'linear-gradient(135deg, #6A3A2A 0%, #3A1A10 100%)',
  },
  {
    id: 10,
    name: '板蓝根颗粒',
    nameEn: 'Ban Lan Gen Granules',
    effect: '清热解毒 · 利咽，用于病毒性感冒、咽喉肿痛',
    effectEn: 'Antiviral · Clears Heat · Flu & Sore Throat Relief',
    price: 28,
    gradient: 'linear-gradient(135deg, #4A7A6A 0%, #253D35 100%)',
  },
]

export default function Shop() {
  const { t, lang } = useLang()
  const addItem = useStore((s) => s.addItem)
  const setCartOpen = useStore((s) => s.setCartOpen)
  const showToast = useStore((s) => s.showToast)

  const handleAdd = (product: Product) => {
    addItem(product)
    showToast(`${lang === 'zh' ? product.name : product.nameEn} ${t.shop.added}`)
    setCartOpen(true)
    setTimeout(() => setCartOpen(false), 2000)
  }

  return (
    <section id="shop" className="py-24 bg-cream">
      <div className="max-w-[1180px] mx-auto px-7">
        <SectionReveal>
          <div className="text-center max-w-[640px] mx-auto mb-14">
            <div className="inline-flex items-center gap-2 text-[12px] tracking-widest uppercase text-clay mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-clay animate-pulse-dot" />
              {t.shop.eyebrow}
            </div>
            <h2 className="font-serif text-[clamp(28px,4vw,44px)] text-ink">{t.shop.title}</h2>
            <p className="mt-4 text-[16px] text-ink-2/75 font-light">{t.shop.sub}</p>
            {/* Tongrentang badge */}
            <div className="inline-flex items-center gap-2 mt-5 bg-paper border border-gold/30 rounded-full px-4 py-2">
              <span className="w-2 h-2 rounded-full bg-gold" />
              <span className="text-[12px] text-gold font-medium tracking-wide">
                {lang === 'zh' ? '同仁堂 · 正品授权' : 'Tongrentang · Authorised'}
              </span>
            </div>
          </div>
        </SectionReveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {TRT_PRODUCTS.map((p, i) => (
            <SectionReveal key={p.id} delay={(i % 5) * 0.07}>
              <div className="bg-paper rounded-[20px] overflow-hidden hover:-translate-y-1.5 transition-transform duration-300 group border border-cream-2/60">
                {/* Product visual */}
                <div
                  className="h-[160px] relative flex items-center justify-center"
                  style={{ background: p.gradient }}
                >
                  {/* Tongrentang badge */}
                  <div className="absolute top-2.5 left-2.5 bg-gold/90 text-ink text-[9px] font-semibold px-2 py-0.5 rounded-full">
                    同仁堂
                  </div>
                  {/* Pill icon */}
                  <div className="opacity-15">
                    <svg width="52" height="52" viewBox="0 0 64 64" fill="none">
                      <circle cx="32" cy="32" r="26" stroke="white" strokeWidth="1.2" strokeDasharray="5 4" />
                      <path
                        d="M32 12 C32 12 22 22 22 32 C22 40.8 26.8 45 32 45 C37.2 45 42 40.8 42 32 C42 22 32 12 32 12Z"
                        stroke="white" strokeWidth="1.4" fill="none"
                      />
                      <line x1="32" y1="18" x2="32" y2="44" stroke="white" strokeWidth="1" />
                    </svg>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3.5">
                  <h3 className="font-serif text-[14.5px] text-ink mb-0.5 leading-snug">
                    {lang === 'zh' ? p.name : p.nameEn}
                  </h3>
                  <p className="text-[11px] text-mut mb-3 min-h-[30px] font-light leading-relaxed line-clamp-2">
                    {lang === 'zh' ? p.effect : p.effectEn}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-[17px] text-ink font-semibold">
                      RM {p.price}
                    </span>
                    <button
                      onClick={() => handleAdd(p)}
                      className="w-8 h-8 rounded-full bg-ink-2 text-white flex items-center justify-center hover:bg-sage transition-all duration-200 hover:rotate-90"
                    >
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
