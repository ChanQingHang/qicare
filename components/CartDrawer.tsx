'use client'

import { useStore } from '@/lib/store'
import { useLang } from '@/lib/i18n'
import { useEffect, useState } from 'react'
import CheckoutModal from './CheckoutModal'

export default function CartDrawer() {
  const { t, lang } = useLang()
  const { items, cartOpen, setCartOpen, removeItem, updateQty, clearCart, total, showToast } =
    useStore()
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCartOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setCartOpen])

  const handleCheckout = () => {
    if (!items.length) {
      showToast(t.cart.emptyAlert)
      return
    }
    setCartOpen(false)
    setCheckoutOpen(true)
  }

  const totalAmt = total()

  return (
    <>
      {/* Backdrop */}
      {cartOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-sm"
          onClick={() => setCartOpen(false)}
        />
      )}

      {/* Checkout Modal */}
      {checkoutOpen && (
        <CheckoutModal onClose={() => setCheckoutOpen(false)} />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-[400px] max-w-[94vw] bg-paper flex flex-col transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          cartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ boxShadow: '-20px 0 60px rgba(27,58,45,0.14)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-cream-2">
          <div className="flex items-center gap-3">
            <h3 className="font-serif text-[19px] text-ink">{t.cart.title}</h3>
            {items.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-ink-2 text-cream text-[11px] flex items-center justify-center font-medium">
                {items.reduce((s, i) => s + i.qty, 0)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={() => {
                  clearCart()
                  showToast(lang === 'zh' ? '购物车已清空' : 'Cart cleared')
                }}
                className="text-[12px] text-mut hover:text-clay transition-colors px-2 py-1 rounded"
              >
                {t.cart.clearCart}
              </button>
            )}
            <button
              onClick={() => setCartOpen(false)}
              className="w-8 h-8 rounded-full bg-cream-2 flex items-center justify-center text-ink-2 hover:bg-cream text-[16px]"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-10">
              {/* Empty bag illustration */}
              <div className="w-20 h-20 rounded-full bg-cream-2 flex items-center justify-center">
                <svg
                  width="36"
                  height="36"
                  fill="none"
                  stroke="#7A8C83"
                  strokeWidth="1.4"
                  viewBox="0 0 24 24"
                  className="opacity-60"
                >
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
              </div>
              <div>
                <p className="text-[15px] text-ink font-medium mb-1">{t.cart.empty}</p>
                <p className="text-[13px] text-mut font-light">{t.cart.emptyHint}</p>
              </div>
              <button
                onClick={() => {
                  setCartOpen(false)
                  document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="mt-1 text-[13px] text-ink-2 border border-ink-2/30 rounded-full px-5 py-2 hover:border-ink-2 transition-colors"
              >
                {lang === 'zh' ? '前往商城 →' : 'Browse Shop →'}
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 py-3.5 border-b border-cream-2/70 last:border-0"
                >
                  {/* Product gradient swatch */}
                  <div
                    className="w-12 h-12 rounded-xl flex-shrink-0"
                    style={{ background: item.gradient }}
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-medium text-ink truncate">
                      {lang === 'zh' ? item.name : item.nameEn}
                    </div>
                    <div className="text-[12.5px] text-clay font-serif font-semibold mt-0.5">
                      RM {item.price}
                    </div>
                  </div>

                  {/* Qty controls */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      className="w-7 h-7 rounded-full border border-cream-2 text-ink-2 flex items-center justify-center hover:border-sage/60 hover:text-sage transition-all text-[16px] leading-none"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-[13px] font-medium text-ink">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      className="w-7 h-7 rounded-full border border-cream-2 text-ink-2 flex items-center justify-center hover:border-sage/60 hover:text-sage transition-all text-[16px] leading-none"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-mut hover:text-clay transition-colors flex-shrink-0 p-1 ml-1"
                  >
                    <svg
                      width="13"
                      height="13"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-cream-2 bg-paper">
            <div className="flex justify-between items-baseline mb-4">
              <span className="text-[14px] text-ink-2">{t.cart.total}</span>
              <div className="text-right">
                <span className="font-serif text-[24px] text-ink font-semibold">
                  RM {totalAmt.toLocaleString()}
                </span>
                {items.length > 1 && (
                  <div className="text-[11px] text-mut mt-0.5">
                    {items.reduce((s, i) => s + i.qty, 0)}{' '}
                    {lang === 'zh' ? '件商品' : 'items'}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-ink text-cream text-[14px] rounded-full py-3.5 hover:bg-ink-2 transition-colors font-medium flex items-center justify-center gap-2"
            >
              {t.cart.checkout}
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </>
  )
}
