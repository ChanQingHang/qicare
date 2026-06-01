'use client'

import { useState, useCallback } from 'react'
import { useLang } from '@/lib/i18n'
import { useStore } from '@/lib/store'

interface Props {
  onClose: () => void
}

const INPUT_CLS =
  'w-full border border-cream-2 bg-white rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-sage transition-colors font-light'

export default function CheckoutModal({ onClose }: Props) {
  const { t, lang } = useLang()
  const { items, total, clearCart } = useStore()

  const [form, setForm] = useState({ name: '', phone: '', address: '' })
  const [errors, setErrors] = useState<Record<string, boolean>>({})
  const [paymentMethod, setPaymentMethod] = useState<'tng' | 'bank' | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [orderNumber, setOrderNumber] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [submitError, setSubmitError] = useState(false)

  const setField = (k: keyof typeof form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: false }))
  }

  const totalAmt = total()

  // Build the formatted WhatsApp message
  const buildWhatsAppMessage = useCallback(
    (orderNo: string) => {
      const itemLines = items
        .map((item) => {
          const name = lang === 'zh' ? item.name : item.nameEn
          return lang === 'zh'
            ? `- ${name} × ${item.qty} = RM ${item.price * item.qty}`
            : `- ${name} × ${item.qty} = RM ${item.price * item.qty}`
        })
        .join('\n')

      const payLabel =
        paymentMethod === 'tng' ? t.checkout.tng : t.checkout.bank

      if (lang === 'zh') {
        return `您好，MYTCM！以下是我的订单信息：\n\n订单编号：${orderNo}\n姓名：${form.name}\n联系：${form.phone}\n收货地址：${form.address}\n\n商品明细：\n${itemLines}\n\n合计：RM ${totalAmt}\n支付方式：${payLabel}\n\n请确认收到订单，谢谢！🙏\n（请查收附上的付款截图）`
      }
      return `Hi MYTCM! Here are my order details:\n\nOrder No.: ${orderNo}\nName: ${form.name}\nPhone: ${form.phone}\nAddress: ${form.address}\n\nItems:\n${itemLines}\n\nTotal: RM ${totalAmt}\nPayment: ${payLabel}\n\nPlease confirm my order, thank you! 🙏\n(Payment screenshot attached)`
    },
    [items, form, paymentMethod, totalAmt, lang, t]
  )

  const handleConfirm = async () => {
    const newErrors: Record<string, boolean> = {}
    if (!form.name.trim()) newErrors.name = true
    if (!form.phone.trim()) newErrors.phone = true
    if (!form.address.trim()) newErrors.address = true
    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) return
    if (!paymentMethod) {
      setErrors((e) => ({ ...e, payment: true }))
      return
    }

    setSubmitting(true)
    setSubmitError(false)

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: form.name,
          customerPhone: form.phone,
          customerAddress: form.address,
          paymentMethod,
          items: items.map((i) => ({
            id: i.id,
            name: i.name,
            nameEn: i.nameEn,
            price: i.price,
            qty: i.qty,
            gradient: i.gradient,
          })),
          totalAmount: totalAmt,
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.orderNumber) throw new Error('Order failed')

      setOrderNumber(data.orderNumber)
      clearCart()
    } catch {
      setSubmitError(true)
    } finally {
      setSubmitting(false)
    }
  }

  const handleCopy = () => {
    if (!orderNumber) return
    navigator.clipboard.writeText(buildWhatsAppMessage(orderNumber)).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  const handleWhatsApp = () => {
    window.open('https://wa.link/rhh5aw', '_blank')
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm animate-fadein"
      onClick={(e) => e.target === e.currentTarget && !orderNumber && onClose()}
    >
      <div className="bg-paper rounded-[28px] w-full max-w-[560px] max-h-[92vh] overflow-y-auto shadow-modal animate-fadein">

        {/* ── RECEIPT VIEW ────────────────────────────── */}
        {orderNumber ? (
          <div className="p-8">
            {/* Success header */}
            <div className="text-center mb-7">
              <div className="w-16 h-16 rounded-full bg-sage flex items-center justify-center text-white text-[26px] mx-auto mb-4 shadow-sm">
                ✓
              </div>
              <h2 className="font-serif text-[24px] text-ink mb-1">{t.checkout.successTitle}</h2>
              <p className="text-[13.5px] text-mut font-light max-w-[340px] mx-auto leading-relaxed">
                {t.checkout.successSub}
              </p>
            </div>

            {/* Order number */}
            <div className="bg-cream border border-cream-2 rounded-2xl px-5 py-3.5 mb-5 flex items-center justify-between">
              <span className="text-[13px] text-mut">{t.checkout.orderNo}</span>
              <span className="font-mono text-[14px] font-semibold text-ink-2 tracking-wide">{orderNumber}</span>
            </div>

            {/* Items summary */}
            <div className="border border-cream-2 rounded-2xl overflow-hidden mb-5">
              {items.length === 0 ? (
                // Items already cleared — show the snapshot before clearing would have been needed
                // We captured via buildWhatsAppMessage which closed over items before clear
                <div className="px-5 py-4 text-[13px] text-mut text-center">
                  {lang === 'zh' ? '订单明细已记录' : 'Order details recorded'}
                </div>
              ) : (
                items.map((item, i) => (
                  <div
                    key={item.id}
                    className={`flex items-center gap-3 px-5 py-3 ${i < items.length - 1 ? 'border-b border-cream-2' : ''}`}
                  >
                    <div className="w-10 h-10 rounded-xl flex-shrink-0" style={{ background: item.gradient }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[13.5px] font-medium text-ink truncate">
                        {lang === 'zh' ? item.name : item.nameEn}
                      </div>
                      <div className="text-[12px] text-mut">× {item.qty}</div>
                    </div>
                    <div className="text-[13.5px] font-serif font-semibold text-clay">
                      RM {item.price * item.qty}
                    </div>
                  </div>
                ))
              )}
              <div className="flex justify-between items-center px-5 py-3.5 bg-cream border-t border-cream-2">
                <span className="text-[14px] font-medium text-ink">{t.cart.total}</span>
                <span className="font-serif text-[20px] font-semibold text-ink">RM {totalAmt}</span>
              </div>
            </div>

            {/* Copyable WhatsApp message */}
            <div className="mb-5">
              <div className="text-[12px] text-mut mb-2 flex items-center gap-1.5">
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                </svg>
                {lang === 'zh' ? '复制以下信息，粘贴至 WhatsApp：' : 'Copy this message and paste into WhatsApp:'}
              </div>
              <pre
                className="bg-cream border border-cream-2 rounded-xl px-4 py-3.5 text-[11.5px] text-ink-2 font-mono leading-relaxed whitespace-pre-wrap break-words"
              >
                {buildWhatsAppMessage(orderNumber)}
              </pre>
            </div>

            {/* Actions */}
            <button
              onClick={handleCopy}
              className={`w-full border rounded-full py-3 text-[13.5px] font-medium transition-all mb-3 ${
                copied
                  ? 'bg-sage text-white border-sage'
                  : 'border-ink-2/30 text-ink-2 hover:border-ink-2 hover:bg-ink-2/5'
              }`}
            >
              {copied ? `✓ ${t.checkout.copied}` : t.checkout.copyMsg}
            </button>

            <button
              onClick={handleWhatsApp}
              className="w-full bg-[#25D366] text-white text-[14px] rounded-full py-3.5 font-medium hover:brightness-105 transition-all mb-3 flex items-center justify-center gap-2"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              {t.checkout.waBtn}
            </button>
            <p className="text-[11.5px] text-mut/70 text-center leading-relaxed mb-4">{t.checkout.waNote}</p>

            <button
              onClick={onClose}
              className="w-full text-[13.5px] text-mut hover:text-ink transition-colors py-2"
            >
              {t.checkout.continueShopping}
            </button>
          </div>

        ) : (
          /* ── FORM VIEW ──────────────────────────────── */
          <div>
            {/* Header */}
            <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-cream-2">
              <h2 className="font-serif text-[22px] text-ink">{t.checkout.title}</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-cream-2 flex items-center justify-center text-ink-2 hover:bg-cream text-[16px]"
              >
                ✕
              </button>
            </div>

            <div className="px-7 py-6 space-y-6">
              {/* Order summary */}
              <div>
                <h3 className="text-[13px] font-medium text-ink-2/70 uppercase tracking-wider mb-3">
                  {t.checkout.summary}
                </h3>
                <div className="border border-cream-2 rounded-2xl overflow-hidden">
                  {items.map((item, i) => (
                    <div
                      key={item.id}
                      className={`flex items-center gap-3 px-4 py-3 ${i < items.length - 1 ? 'border-b border-cream-2' : ''}`}
                    >
                      <div className="w-10 h-10 rounded-xl flex-shrink-0" style={{ background: item.gradient }} />
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-medium text-ink truncate">
                          {lang === 'zh' ? item.name : item.nameEn}
                        </div>
                        <div className="text-[12px] text-mut">× {item.qty}</div>
                      </div>
                      <div className="text-[13.5px] font-serif font-semibold text-clay">
                        RM {item.price * item.qty}
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center px-4 py-3 bg-cream border-t border-cream-2">
                    <span className="text-[13.5px] font-medium text-ink">{t.cart.total}</span>
                    <span className="font-serif text-[20px] font-semibold text-ink">RM {totalAmt}</span>
                  </div>
                </div>
              </div>

              {/* Delivery info */}
              <div>
                <h3 className="text-[13px] font-medium text-ink-2/70 uppercase tracking-wider mb-3">
                  {t.checkout.deliveryTitle}
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[12.5px] text-ink-2 mb-1.5 font-medium">{t.checkout.nameLabel}</label>
                    <div className={errors.name ? 'ring-1 ring-red-400 rounded-xl' : ''}>
                      <input
                        className={INPUT_CLS}
                        placeholder={t.checkout.namePlaceholder}
                        value={form.name}
                        onChange={(e) => setField('name', e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[12.5px] text-ink-2 mb-1.5 font-medium">{t.checkout.phoneLabel}</label>
                    <div className={errors.phone ? 'ring-1 ring-red-400 rounded-xl' : ''}>
                      <input
                        className={INPUT_CLS}
                        placeholder={t.checkout.phonePlaceholder}
                        value={form.phone}
                        onChange={(e) => setField('phone', e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[12.5px] text-ink-2 mb-1.5 font-medium">{t.checkout.addressLabel}</label>
                    <div className={errors.address ? 'ring-1 ring-red-400 rounded-xl' : ''}>
                      <textarea
                        className={`${INPUT_CLS} resize-none`}
                        rows={2}
                        placeholder={t.checkout.addressPlaceholder}
                        value={form.address}
                        onChange={(e) => setField('address', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment method */}
              <div>
                <h3 className={`text-[13px] font-medium uppercase tracking-wider mb-3 ${errors.payment ? 'text-red-500' : 'text-ink-2/70'}`}>
                  {t.checkout.paymentTitle}
                </h3>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {(['tng', 'bank'] as const).map((method) => (
                    <button
                      key={method}
                      onClick={() => {
                        setPaymentMethod(method)
                        setErrors((e) => ({ ...e, payment: false }))
                      }}
                      className={`border rounded-2xl p-4 text-left transition-all ${
                        paymentMethod === method
                          ? 'border-sage bg-sage/8 ring-1 ring-sage/30'
                          : 'border-cream-2 bg-white hover:border-sage/50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                            paymentMethod === method ? 'border-sage' : 'border-cream-2'
                          }`}
                        >
                          {paymentMethod === method && (
                            <div className="w-2 h-2 rounded-full bg-sage" />
                          )}
                        </div>
                        <span className="text-[13px] font-medium text-ink">
                          {method === 'tng' ? t.checkout.tng : t.checkout.bank}
                        </span>
                      </div>
                      {method === 'tng' ? (
                        <div className="text-[11px] text-mut pl-6">Touch &apos;n Go eWallet</div>
                      ) : (
                        <div className="text-[11px] text-mut pl-6">Maybank / DuitNow</div>
                      )}
                    </button>
                  ))}
                </div>

                {/* QR display */}
                {paymentMethod && (
                  <div className="bg-white border border-cream-2 rounded-2xl p-5 animate-fadein">
                    <div className="flex flex-col items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={paymentMethod === 'tng' ? '/tng-qr.jpeg' : '/bank-qr.jpeg'}
                        alt={paymentMethod === 'tng' ? 'TNG QR' : 'Bank QR'}
                        className="w-[200px] h-[200px] object-contain rounded-xl"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                      {paymentMethod === 'bank' && (
                        <div className="text-[13px] font-medium text-ink-2 text-center">
                          {t.checkout.bankAccount}
                        </div>
                      )}
                      <p className="text-[12.5px] text-mut text-center leading-relaxed max-w-[260px]">
                        {paymentMethod === 'tng' ? t.checkout.tngHint : t.checkout.bankHint}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Error message */}
              {submitError && (
                <p className="text-[13px] text-red-500 text-center animate-fadein">{t.checkout.errorMsg}</p>
              )}

              {/* Confirm button */}
              <button
                onClick={handleConfirm}
                disabled={submitting}
                className="w-full bg-ink-2 text-white text-[14.5px] rounded-full py-4 font-medium hover:bg-ink transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin-slow" />
                    {t.checkout.confirming}
                  </span>
                ) : (
                  `${t.checkout.confirmBtn} · RM ${totalAmt}`
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
