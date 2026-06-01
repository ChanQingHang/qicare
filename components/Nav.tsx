'use client'

import { useEffect, useState } from 'react'
import { useLang } from '@/lib/i18n'
import { useStore } from '@/lib/store'

function MytcmLogo({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const leafH = size === 'sm' ? 28 : 34
  const leafW = size === 'sm' ? 22 : 27
  return (
    <div className="flex items-center gap-2.5">
      {/* Minimal leaf icon */}
      <svg width={leafW} height={leafH} viewBox="0 0 27 34" fill="none" aria-hidden="true">
        <path
          d="M13.5 1 C19 8 23 17 20 25 C18 30 16 33 13.5 34 C11 33 9 30 7 25 C4 17 8 8 13.5 1Z"
          fill="#52B788"
        />
        <line
          x1="13.5" y1="5" x2="13.5" y2="32"
          stroke="white" strokeWidth="0.85" strokeOpacity="0.45"
        />
        <path
          d="M13.5 15 C11.5 13 9 13 7 14"
          stroke="white" strokeWidth="0.75" strokeLinecap="round" strokeOpacity="0.35"
        />
        <path
          d="M13.5 21 C15.5 19 18 19 20 20"
          stroke="white" strokeWidth="0.75" strokeLinecap="round" strokeOpacity="0.35"
        />
      </svg>

      {/* Brand text */}
      <div className="flex flex-col leading-none gap-[2px]">
        <span
          className="text-ink font-black tracking-tight"
          style={{ fontSize: size === 'sm' ? '15px' : '18px', letterSpacing: '-0.03em', fontFamily: "system-ui,-apple-system,sans-serif" }}
        >
          MYTCM
        </span>
        <span
          className="text-mut"
          style={{ fontSize: size === 'sm' ? '8.5px' : '9.5px', letterSpacing: '0.06em', fontFamily: "var(--font-sans)" }}
        >
          大马中医
        </span>
      </div>
    </div>
  )
}

export default function Nav() {
  const { t, lang, setLang } = useLang()
  const count = useStore((s) => s.count)()
  const setCartOpen = useStore((s) => s.setCartOpen)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: '#ai', label: t.nav.aiConsult },
    { href: '#book', label: t.nav.booking },
    { href: '#cases', label: t.nav.cases },
    { href: '#shop', label: t.nav.shop },
    { href: '#recruit', label: t.nav.recruit },
  ]

  const scrollTo = (id: string) => {
    document.getElementById(id.slice(1))?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-cream/90 backdrop-blur-md shadow-[0_1px_0_rgba(27,58,45,0.08)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1180px] mx-auto px-7">
        <nav className="flex items-center justify-between h-[70px]">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="cursor-pointer"
            aria-label="MYTCM Home"
          >
            <MytcmLogo />
          </button>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href)}
                className="text-[14px] text-ink-2 hover:text-sage transition-colors duration-200 relative group py-1"
              >
                {l.label}
                <span className="absolute bottom-0 left-0 w-0 h-px bg-sage transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
              className="text-[12.5px] text-mut hover:text-ink-2 transition-colors border border-cream-2 rounded-full px-3 py-1.5 hover:border-sage/60"
            >
              {lang === 'zh' ? 'EN' : '中文'}
            </button>

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative text-ink-2 hover:text-sage transition-colors p-1"
              aria-label={t.nav.cart}
            >
              <svg width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {count > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-sage text-white text-[10px] min-w-[17px] h-[17px] rounded-full flex items-center justify-center font-sans leading-none">
                  {count}
                </span>
              )}
            </button>

            {/* CTA */}
            <button
              onClick={() => scrollTo('#ai')}
              className="hidden md:flex items-center bg-ink-2 text-white text-[13px] rounded-full px-5 py-2.5 hover:bg-ink transition-all duration-200 hover:-translate-y-px"
            >
              {t.nav.startConsult}
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-ink-2 p-1"
              aria-label="Menu"
            >
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                ) : (
                  <>
                    <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
                    <line x1="3" y1="12" x2="21" y2="12" strokeLinecap="round" />
                    <line x1="3" y1="18" x2="21" y2="18" strokeLinecap="round" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-cream border-t border-cream-2 px-7 py-5 flex flex-col gap-4 shadow-lg">
          {links.map((l) => (
            <button
              key={l.href}
              onClick={() => scrollTo(l.href)}
              className="text-left text-[15px] text-ink-2 hover:text-sage transition-colors py-1"
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => { scrollTo('#ai'); setMenuOpen(false) }}
            className="mt-2 bg-ink-2 text-white text-[14px] rounded-full px-5 py-3 text-center hover:bg-ink transition-colors"
          >
            {t.nav.startConsult}
          </button>
        </div>
      )}
    </header>
  )
}
