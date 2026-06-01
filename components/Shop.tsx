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

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: '金银花茶',
    nameEn: 'Honeysuckle Tea',
    effect: '清热解毒 · 缓解咽喉不适',
    effectEn: 'Clears Heat · Soothes Sore Throat',
    price: 28,
    gradient: 'linear-gradient(135deg, #d8e6c0 0%, #9fbf7a 100%)',
  },
  {
    id: 2,
    name: '枸杞菊花',
    nameEn: 'Goji & Chrysanthemum',
    effect: '养肝明目 · 清肝降火',
    effectEn: 'Nourish Liver · Brighten Eyes',
    price: 32,
    gradient: 'linear-gradient(135deg, #f0d59a 0%, #d8a23e 100%)',
  },
  {
    id: 3,
    name: '参苓白术散',
    nameEn: 'Shen Ling Bai Zhu San',
    effect: '健脾益气 · 祛湿和胃',
    effectEn: 'Strengthen Spleen · Resolve Dampness',
    price: 58,
    gradient: 'linear-gradient(135deg, #e0cba0 0%, #b89a6a 100%)',
  },
  {
    id: 4,
    name: '酸枣仁膏',
    nameEn: 'Sour Jujube Paste',
    effect: '宁心安神 · 改善睡眠',
    effectEn: 'Calm Mind · Improve Sleep',
    price: 68,
    gradient: 'linear-gradient(135deg, #c9a07a 0%, #8a5a3a 100%)',
  },
  {
    id: 5,
    name: '四物汤料包',
    nameEn: 'Si Wu Tang Pack',
    effect: '补血调经 · 女性调理',
    effectEn: "Nourish Blood · Women's Tonic",
    price: 45,
    gradient: 'linear-gradient(135deg, #d99a9a 0%, #a65a5a 100%)',
  },
  {
    id: 6,
    name: '黄芪片',
    nameEn: 'Astragalus Slices',
    effect: '补气固表 · 增强体质',
    effectEn: 'Boost Qi · Strengthen Immunity',
    price: 38,
    gradient: 'linear-gradient(135deg, #e6d3a0 0%, #c2a05a 100%)',
  },
  {
    id: 7,
    name: '陈皮普洱',
    nameEn: 'Aged Peel Pu-erh',
    effect: '理气健脾 · 助消化',
    effectEn: 'Move Qi · Aid Digestion',
    price: 42,
    gradient: 'linear-gradient(135deg, #c2906a 0%, #8a5a3a 100%)',
  },
  {
    id: 8,
    name: '罗汉果茶',
    nameEn: 'Monk Fruit Tea',
    effect: '润肺利咽 · 清热解燥',
    effectEn: 'Moisten Lungs · Clear Dryness',
    price: 26,
    gradient: 'linear-gradient(135deg, #bfa87a 0%, #8a7440 100%)',
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
          <div className="text-center max-w-[600px] mx-auto mb-14">
            <div className="inline-flex items-center gap-2 text-[12px] tracking-widest uppercase text-clay mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-clay animate-pulse-dot" />
              {t.shop.eyebrow}
            </div>
            <h2 className="font-serif text-[clamp(28px,4vw,44px)] text-ink">{t.shop.title}</h2>
            <p className="mt-4 text-[16px] text-ink-2/80 font-light">{t.shop.sub}</p>
          </div>
        </SectionReveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {PRODUCTS.map((p, i) => (
            <SectionReveal key={p.id} delay={(i % 4) * 0.08}>
              <div className="bg-paper rounded-[22px] overflow-hidden hover:-translate-y-1.5 transition-transform duration-300 shadow-card group">
                {/* Product image */}
                <div
                  className="h-[190px] relative"
                  style={{ background: p.gradient }}
                >
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                      <circle cx="32" cy="32" r="28" stroke="white" strokeWidth="1" strokeDasharray="4 4" />
                      <path d="M32 10 C32 10 20 22 20 34 C20 42 25.4 46 32 46 C38.6 46 44 42 44 34 C44 22 32 10 32 10Z" stroke="white" strokeWidth="1.5" fill="none" />
                      <line x1="32" y1="18" x2="32" y2="46" stroke="white" strokeWidth="1" />
                    </svg>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-serif text-[15.5px] text-ink mb-1">
                    {lang === 'zh' ? p.name : p.nameEn}
                  </h3>
                  <p className="text-[12px] text-mut mb-3 min-h-[32px] font-light leading-relaxed">
                    {lang === 'zh' ? p.effect : p.effectEn}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-[20px] text-ink font-semibold">
                      RM {p.price}
                    </span>
                    <button
                      onClick={() => handleAdd(p)}
                      className="w-9 h-9 rounded-full bg-ink-2 text-cream flex items-center justify-center hover:bg-clay transition-all duration-200 hover:rotate-90"
                    >
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
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
