'use client'

import Link from 'next/link'
import { useLang } from '@/lib/i18n'

function MytcmLogoFooter() {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <svg width="24" height="30" viewBox="0 0 27 34" fill="none" aria-hidden="true">
        <path
          d="M13.5 1 C19 8 23 17 20 25 C18 30 16 33 13.5 34 C11 33 9 30 7 25 C4 17 8 8 13.5 1Z"
          fill="#52B788"
        />
        <line x1="13.5" y1="5" x2="13.5" y2="32" stroke="white" strokeWidth="0.85" strokeOpacity="0.45" />
        <path d="M13.5 15 C11.5 13 9 13 7 14" stroke="white" strokeWidth="0.75" strokeLinecap="round" strokeOpacity="0.35" />
        <path d="M13.5 21 C15.5 19 18 19 20 20" stroke="white" strokeWidth="0.75" strokeLinecap="round" strokeOpacity="0.35" />
      </svg>
      <div className="flex flex-col leading-none gap-[2px]">
        <span
          className="text-cream font-black"
          style={{ fontSize: '16px', letterSpacing: '-0.03em', fontFamily: "system-ui,-apple-system,sans-serif" }}
        >
          MYTCM
        </span>
        <span
          className="text-cream/50"
          style={{ fontSize: '8.5px', letterSpacing: '0.06em' }}
        >
          大马中医
        </span>
      </div>
    </div>
  )
}

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
            <MytcmLogoFooter />
            <p className="text-[13px] font-light leading-relaxed max-w-[240px] text-cream/60">
              {t.footer.tagline}
            </p>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-[13.5px] text-cream font-medium mb-3">{t.footer.featuresTitle}</h4>
            {[
              { id: 'ai', label: t.nav.aiConsult },
              { id: 'book', label: t.nav.booking },
              { id: 'cases', label: t.nav.cases },
              { id: 'shop', label: t.nav.shop },
            ].map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="block text-[13px] text-cream/55 hover:text-sage-l transition-colors py-1.5 font-light"
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[13.5px] text-cream font-medium mb-3">{t.footer.aboutTitle}</h4>
            <button
              onClick={() => scrollTo('recruit')}
              className="block text-[13px] text-cream/55 hover:text-sage-l transition-colors py-1.5 font-light text-left"
            >
              {t.nav.recruit}
            </button>
            <Link
              href="/about"
              className="block text-[13px] text-cream/55 hover:text-sage-l transition-colors py-1.5 font-light"
            >
              {t.footer.about}
            </Link>
            <Link
              href="/privacy"
              className="block text-[13px] text-cream/55 hover:text-sage-l transition-colors py-1.5 font-light"
            >
              {t.footer.privacy}
            </Link>
            <Link
              href="/terms"
              className="block text-[13px] text-cream/55 hover:text-sage-l transition-colors py-1.5 font-light"
            >
              {t.footer.terms}
            </Link>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[13.5px] text-cream font-medium mb-3">{t.footer.contactTitle}</h4>
            <a
              href="mailto:qinghang7@gmail.com"
              className="block text-[13px] text-cream/55 hover:text-sage-l transition-colors py-1.5 font-light"
            >
              qinghang7@gmail.com
            </a>
            <a
              href="https://wa.link/rhh5aw"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-[13px] text-cream/55 hover:text-sage-l transition-colors py-1.5 font-light"
            >
              {t.footer.whatsapp}
            </a>
            <p className="text-[13px] text-cream/55 py-1.5 font-light">
              Johor Bahru, Johor, Malaysia
            </p>
          </div>
        </div>

        <div className="border-t border-cream/10 pt-6 flex flex-col sm:flex-row justify-between gap-3 text-[12px] text-cream/40">
          <span>{t.footer.copyright}</span>
          <span className="max-w-[480px] sm:text-right">{t.footer.disclaimer}</span>
        </div>
      </div>
    </footer>
  )
}
