'use client'

import { useLang } from '@/lib/i18n'

export default function Footer() {
  const { t } = useLang()

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="bg-ink text-cream/65 pt-16 pb-8">
      <div className="max-w-[1180px] mx-auto px-7">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <svg width="34" height="34" viewBox="0 0 44 44" fill="none">
                <rect x="2" y="2" width="40" height="40" rx="13" fill="#1F3A2E" />
                <path d="M22 11 C22 11 13 18 13 26 C13 31 17 34 22 34 C27 34 31 31 31 26 C31 18 22 11 22 11Z" fill="none" stroke="#A7BF9E" strokeWidth="1.6" />
                <path d="M22 15 C22 15 22 24 22 33" stroke="#C8A96A" strokeWidth="1.4" strokeLinecap="round" />
                <circle cx="22" cy="11" r="2.4" fill="#C2724E" />
              </svg>
              <span className="font-serif text-[18px] font-semibold text-cream">岐黄云诊</span>
            </div>
            <p className="text-[13.5px] font-light leading-relaxed max-w-[240px]">
              {t.footer.tagline}
            </p>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-[14px] text-cream font-medium mb-3">{t.footer.featuresTitle}</h4>
            {[
              { id: 'ai', label: t.nav.aiConsult },
              { id: 'book', label: t.nav.booking },
              { id: 'cases', label: t.nav.cases },
              { id: 'shop', label: t.nav.shop },
            ].map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="block text-[13.5px] text-cream/60 hover:text-gold transition-colors py-1.5 font-light"
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* About */}
          <div>
            <h4 className="text-[14px] text-cream font-medium mb-3">{t.footer.aboutTitle}</h4>
            {[
              { label: t.nav.recruit, id: 'recruit' },
              { label: t.footer.about },
              { label: t.footer.privacy },
              { label: t.footer.terms },
            ].map((l, i) => (
              <button
                key={i}
                onClick={() => l.id && scrollTo(l.id)}
                className="block text-[13.5px] text-cream/60 hover:text-gold transition-colors py-1.5 font-light text-left"
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[14px] text-cream font-medium mb-3">{t.footer.contactTitle}</h4>
            <p className="text-[13.5px] text-cream/60 py-1.5 font-light">{t.footer.support}</p>
            <p className="text-[13.5px] text-cream/60 py-1.5 font-light">{t.footer.whatsapp}</p>
            <p className="text-[13.5px] text-cream/60 py-1.5 font-light">{t.footer.address}</p>
          </div>
        </div>

        <div className="border-t border-cream/12 pt-6 flex flex-col sm:flex-row justify-between gap-3 text-[12.5px] text-cream/45">
          <span>{t.footer.copyright}</span>
          <span>{t.footer.disclaimer}</span>
        </div>
      </div>
    </footer>
  )
}
