'use client'

import { useStore } from '@/lib/store'
import { useLang } from '@/lib/i18n'
import { useEffect } from 'react'

export default function CartDrawer() {
  const { t, lang } = useLang()
  const { items, cartOpen, setCartOpen, removeItem, total, showToast } = useStore()

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setCartOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setCartOpen])

  const handleCheckout = () => {
    if (!items.length) { showToast(t.cart.emptyAlert); return }
    showToast(t.cart.checkoutMsg)
    setCartOpen(false)
  }

  return (
    <>
      {/* Backdrop */}
      {cartOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-sm"
          onClick={() => setCartOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-[380px] max-w-[92vw] bg-paper flex flex-col shadow-[−20px_0_60px_rgba(0,0,0,0.2)] transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          cartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-cream-2">
          <h3 className="font-serif text-[19px] text-ink">{t.cart.title}</h3>
          <button
            onClick={() => setCartOpen(false)}
            className="w-8 h-8 rounded-full bg-cream-2 flex items-center justify-center text-ink-2 hover:bg-cream text-[17px]"
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-mut text-[14px] gap-3 text-center">
              <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24" className="opacity-30">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {t.cart.empty.split('\n').map((line, i) => <span key={i}>{line}</span>)}
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 py-3 border-b border-cream-2 last:border-0"
              >
                <div
                  className="w-14 h-14 rounded-xl flex-shrink-0"
                  style={{ background: item.gradient }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-medium text-ink-2 truncate">
                    {lang === 'zh' ? item.name : item.nameEn}
                  </div>
                  <div className="text-[13px] text-clay font-serif font-semibold">
                    RM {item.price} × {item.qty}
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-mut hover:text-clay transition-colors flex-shrink-0 p-1"
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-cream-2">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[15px] text-ink-2">{t.cart.total}</span>
            <span className="font-serif text-[22px] text-ink font-semibold">RM {total()}</span>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full bg-ink text-cream text-[14px] rounded-full py-3.5 hover:bg-ink-2 transition-colors font-medium"
          >
            {t.cart.checkout}
          </button>
        </div>
      </div>
    </>
  )
}
