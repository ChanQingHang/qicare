'use client'

import { useEffect, useState } from 'react'
import { useLang } from '@/lib/i18n'
import { useStore } from '@/lib/store'

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
          ? 'bg-cream/90 backdrop-blur-md shadow-[0_1px_0_rgba(22,48,42,0.08)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1180px] mx-auto px-7">
        <nav className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 cursor-pointer"
            aria-label="QiCare Home"
          >
            <svg width="36" height="36" viewBox="0 0 44 44" fill="none">
              <rect x="2" y="2" width="40" height="40" rx="13" fill="#16302A" />
              <path
                d="M22 11 C22 11 13 18 13 26 C13 31 17 34 22 34 C27 34 31 31 31 26 C31 18 22 11 22 11Z"
                fill="none"
                stroke="#A7BF9E"
                strokeWidth="1.6"
              />
              <path
                d="M22 15 C22 15 22 24 22 33"
                stroke="#C8A96A"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
              <path
                d="M22 22 C19 20 16 20 14.5 21"
                stroke="#C8A96A"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <path
                d="M22 26 C25 24 28 24 29.5 25"
                stroke="#C8A96A"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <circle cx="22" cy="11" r="2.4" fill="#C2724E" />
            </svg>
            <span className="font-serif text-[20px] font-semibold text-ink tracking-wide">
              岐黄云诊
            </span>
          </button>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <button
                key={l.href}
                onClick={() => scrollTo(l.href)}
                className="text-[14px] text-ink-2 hover:text-clay transition-colors duration-200 relative group py-1"
              >
                {l.label}
                <span className="absolute bottom-0 left-0 w-0 h-px bg-clay transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
              className="text-[13px] text-mut hover:text-ink-2 transition-colors border border-cream-2 rounded-full px-3 py-1.5 hover:border-sage"
            >
              {lang === 'zh' ? 'EN' : '中文'}
            </button>

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative text-ink-2 hover:text-clay transition-colors p-1"
              aria-label={t.nav.cart}
            >
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {count > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-clay text-white text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center font-sans leading-none">
                  {count}
                </span>
              )}
            </button>

            {/* CTA */}
            <button
              onClick={() => scrollTo('#ai')}
              className="hidden md:flex items-center bg-ink text-cream text-[13.5px] rounded-full px-5 py-2.5 hover:bg-ink-2 transition-all duration-200 hover:-translate-y-px"
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
              className="text-left text-[15px] text-ink-2 hover:text-clay transition-colors py-1"
            >
              {l.label}
            </button>
          ))}
          <button
            onClick={() => { scrollTo('#ai'); setMenuOpen(false) }}
            className="mt-2 bg-ink text-cream text-[14px] rounded-full px-5 py-3 text-center hover:bg-ink-2 transition-colors"
          >
            {t.nav.startConsult}
          </button>
        </div>
      )}
    </header>
  )
}
