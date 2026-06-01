'use client'

import { motion } from 'framer-motion'
import { useLang } from '@/lib/i18n'

export default function Hero() {
  const { t } = useLang()

  return (
    <section className="relative min-h-screen flex items-center pt-[72px] overflow-hidden bg-cream">
      {/* Background blobs */}
      <div
        className="absolute top-[-80px] right-[-60px] w-[480px] h-[480px] rounded-full opacity-40 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #A7BF9E 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="absolute bottom-[-100px] left-[-80px] w-[400px] h-[400px] rounded-full opacity-25 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #C8A96A 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      <div className="max-w-[1180px] mx-auto px-7 py-20 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left — Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 text-[12.5px] tracking-widest uppercase text-clay mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-clay animate-pulse-dot" />
              {t.hero.eyebrow}
            </div>

            <h1 className="font-serif text-[clamp(44px,6.5vw,80px)] leading-[1.02] font-medium text-ink">
              {t.hero.title1}
              <br />
              <em className="not-italic text-clay">{t.hero.title2}</em>
            </h1>

            <p className="text-[17px] text-ink-2 mt-6 mb-8 max-w-[460px] font-light leading-relaxed">
              {t.hero.lead}
            </p>

            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() =>
                  document.getElementById('ai')?.scrollIntoView({ behavior: 'smooth' })
                }
                className="bg-ink text-cream text-[14px] rounded-full px-7 py-3.5 hover:bg-ink-2 transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
              >
                {t.hero.cta1}
              </button>
              <button
                onClick={() =>
                  document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })
                }
                className="bg-transparent text-ink-2 text-[14px] rounded-full px-7 py-3.5 border border-ink-2/30 hover:border-ink-2 hover:bg-ink-2/5 transition-all duration-200"
              >
                {t.hero.cta2}
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-5 flex-wrap mt-7 text-[12.5px] text-mut">
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                {t.hero.trust1}
              </span>
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                {t.hero.trust2}
              </span>
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z" />
                  <path d="M12 6v6l4 2" />
                </svg>
                {t.hero.trust3}
              </span>
            </div>
          </motion.div>

          {/* Right — Visual */}
          <motion.div
            className="relative h-[440px] md:h-[520px]"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Main visual card */}
            <div className="absolute inset-0 rounded-[32px] overflow-hidden">
              <div
                className="w-full h-full"
                style={{
                  background:
                    'linear-gradient(145deg, #1F3A2E 0%, #16302A 40%, #0d2219 100%)',
                }}
              >
                {/* Decorative herb lines */}
                <svg
                  className="absolute inset-0 w-full h-full opacity-10"
                  viewBox="0 0 400 520"
                  fill="none"
                >
                  <circle cx="200" cy="260" r="160" stroke="#A7BF9E" strokeWidth="0.8" strokeDasharray="4 6" />
                  <circle cx="200" cy="260" r="120" stroke="#C8A96A" strokeWidth="0.6" strokeDasharray="3 8" />
                  <circle cx="200" cy="260" r="80" stroke="#A7BF9E" strokeWidth="0.5" strokeDasharray="2 10" />
                  <line x1="200" y1="100" x2="200" y2="420" stroke="#A7BF9E" strokeWidth="0.5" opacity="0.5" />
                  <line x1="40" y1="260" x2="360" y2="260" stroke="#A7BF9E" strokeWidth="0.5" opacity="0.5" />
                  <path d="M200 140 C160 180 130 220 130 260 C130 300 160 330 200 330 C240 330 270 300 270 260 C270 220 240 180 200 140Z" stroke="#A7BF9E" strokeWidth="0.8" fill="none" />
                </svg>

                {/* Center element */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div
                      className="w-24 h-20 rounded-[50%_50%_40%_40%/60%_60%_40%_40%] mx-auto mb-4"
                      style={{
                        background: 'linear-gradient(160deg, #E8B4A8, #D2786B)',
                        boxShadow: 'inset 0 -10px 20px rgba(0,0,0,0.15)',
                      }}
                    />
                    <div className="text-sage-l/60 text-[13px]">舌象示例</div>
                  </div>
                </div>

                {/* Top right badge */}
                <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-2.5 border border-white/10">
                  <div className="text-[11px] text-sage-l/80">Gemini AI</div>
                  <div className="text-[13px] text-cream font-medium mt-0.5">1.5 Flash</div>
                </div>
              </div>
            </div>

            {/* Floating AI Analysis Card */}
            <div className="animate-floaty absolute -left-4 bottom-8 bg-paper rounded-2xl p-4 w-[210px] shadow-[0_20px_60px_rgba(22,48,42,0.2)] border border-cream-2">
              <div className="flex items-center gap-2.5 mb-3">
                <div
                  className="w-9 h-9 rounded-xl flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #E8B4A8, #D88B7C)' }}
                />
                <div>
                  <div className="text-[13px] font-medium text-ink">{t.hero.scanLabel}</div>
                  <div className="text-[11px] text-mut">{t.hero.scanSub}</div>
                </div>
              </div>
              <div className="h-1.5 rounded-full bg-cream-2 overflow-hidden mb-2">
                <div className="h-full w-[72%] rounded-full bg-sage" />
              </div>
              <div className="text-[11.5px] text-txt/80">{t.hero.scanResult}</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
