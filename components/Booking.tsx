'use client'

import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLang } from '@/lib/i18n'
import { useStore } from '@/lib/store'

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

interface Doctor {
  id: number
  name: string
  nameEn: string
  spec: string
  specEn: string
  years: number
  rating: number
  whatsapp: string
  gradient: string
}

const DOCTORS: Doctor[] = [
  {
    id: 1,
    name: '李明华 医师',
    nameEn: 'Dr. Li Minghua',
    spec: '内科 · 脾胃调理',
    specEn: 'Internal · Spleen & Stomach',
    years: 20,
    rating: 4.9,
    whatsapp: '60123456789',
    gradient: 'linear-gradient(135deg, #6E8C6A 0%, #1F3A2E 100%)',
  },
  {
    id: 2,
    name: '陈雅芳 医师',
    nameEn: 'Dr. Chan Yafang',
    spec: '妇科 · 调经养颜',
    specEn: "Women's Health · Gynaecology",
    years: 15,
    rating: 4.8,
    whatsapp: '60187654321',
    gradient: 'linear-gradient(135deg, #C2724E 0%, #8a4a2e 100%)',
  },
  {
    id: 3,
    name: '王志强 医师',
    nameEn: 'Dr. Wong Zhiqiang',
    spec: '针灸 · 颈肩腰腿',
    specEn: 'Acupuncture · Musculoskeletal',
    years: 18,
    rating: 5.0,
    whatsapp: '60111234567',
    gradient: 'linear-gradient(135deg, #C8A96A 0%, #8a6f3a 100%)',
  },
]

const SLOTS = [
  '今 14:00', '今 16:30',
  '明 09:30', '明 11:00', '明 15:00',
  '后天 10:00', '后天 14:30', '后天 17:00',
]

const SLOTS_EN = [
  'Today 14:00', 'Today 16:30',
  'Tmrw 09:30', 'Tmrw 11:00', 'Tmrw 15:00',
  '+2d 10:00', '+2d 14:30', '+2d 17:00',
]

export default function Booking() {
  const { t, lang } = useLang()
  const showToast = useStore((s) => s.showToast)

  const [selectedDoc, setSelectedDoc] = useState<Doctor | null>(null)
  const [mode, setMode] = useState<'online' | 'offline'>('online')
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const slots = lang === 'zh' ? SLOTS : SLOTS_EN

  const openModal = (doc: Doctor) => {
    setSelectedDoc(doc)
    setMode('online')
    setSelectedTime(null)
  }

  const confirmBooking = () => {
    if (!selectedTime || !selectedDoc) {
      showToast(t.booking.selectTime)
      return
    }
    const modeLabel = mode === 'online' ? t.booking.online.replace('📹 ', '') : t.booking.offline.replace('🏥 ', '')
    const docName = lang === 'zh' ? selectedDoc.name : selectedDoc.nameEn
    const msg = lang === 'zh'
      ? `您好，我想预约【${docName}】的${modeLabel}问诊，时间：${selectedTime}。`
      : `Hi, I'd like to book a ${modeLabel} consultation with ${docName} at ${selectedTime}.`
    const url = `https://wa.me/${selectedDoc.whatsapp}?text=${encodeURIComponent(msg)}`
    window.open(url, '_blank')
    showToast(t.booking.opening)
    setSelectedDoc(null)
  }

  return (
    <>
      <section id="book" className="py-24 bg-cream">
        <div className="max-w-[1180px] mx-auto px-7">
          <SectionReveal>
            <div className="text-center max-w-[600px] mx-auto mb-14">
              <div className="inline-flex items-center gap-2 text-[12px] tracking-widest uppercase text-clay mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-clay animate-pulse-dot" />
                {t.booking.eyebrow}
              </div>
              <h2 className="font-serif text-[clamp(28px,4vw,44px)] text-ink">{t.booking.title}</h2>
              <p className="mt-4 text-[16px] text-ink-2/80 font-light">{t.booking.sub}</p>
            </div>
          </SectionReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {DOCTORS.map((doc, i) => (
              <SectionReveal key={doc.id} delay={i * 0.1}>
                <div className="bg-paper rounded-[24px] overflow-hidden hover:-translate-y-1.5 transition-transform duration-300 cursor-pointer shadow-card">
                  {/* Photo */}
                  <div
                    className="h-[220px] relative"
                    style={{ background: doc.gradient }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center font-serif text-[32px] text-white">
                        {(lang === 'zh' ? doc.name : doc.nameEn).charAt(lang === 'zh' ? 0 : 3)}
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <h3 className="font-serif text-[18px] text-ink mb-0.5">
                      {lang === 'zh' ? doc.name : doc.nameEn}
                    </h3>
                    <div className="text-[13px] text-clay mb-3">
                      {lang === 'zh' ? doc.spec : doc.specEn}
                    </div>
                    <div className="flex items-center gap-4 text-[13px] text-mut mb-4">
                      <span className="flex items-center gap-1">
                        <span className="text-gold">★</span>
                        <strong className="text-ink-2 font-medium">{doc.rating}</strong>
                      </span>
                      <span>
                        {t.booking.experience}{' '}
                        <strong className="text-ink-2 font-medium">
                          {doc.years}{t.booking.years}
                        </strong>
                      </span>
                    </div>
                    <div className="flex gap-2 mb-4">
                      <span className="text-[11.5px] bg-cream-2 text-ink-2 px-3 py-1 rounded-full">
                        {t.booking.online}
                      </span>
                      <span className="text-[11.5px] bg-cream-2 text-ink-2 px-3 py-1 rounded-full">
                        {t.booking.offline}
                      </span>
                    </div>
                    <button
                      onClick={() => openModal(doc)}
                      className="w-full bg-ink text-cream text-[13.5px] rounded-full py-2.5 hover:bg-ink-2 transition-colors"
                    >
                      {t.booking.bookBtn}
                    </button>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {selectedDoc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-ink/50 backdrop-blur-sm animate-fadein"
          onClick={(e) => e.target === e.currentTarget && setSelectedDoc(null)}
        >
          <div className="bg-paper rounded-[26px] w-full max-w-[480px] max-h-[88vh] overflow-y-auto p-8 relative shadow-modal animate-fadein">
            <button
              onClick={() => setSelectedDoc(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-cream-2 flex items-center justify-center text-ink-2 hover:bg-cream text-[18px]"
            >
              ✕
            </button>

            <h3 className="font-serif text-[22px] text-ink mb-1">
              {t.booking.modalTitle} · {lang === 'zh' ? selectedDoc.name : selectedDoc.nameEn}
            </h3>
            <p className="text-[13.5px] text-mut mb-5">
              {lang === 'zh' ? selectedDoc.spec : selectedDoc.specEn} · {selectedDoc.years}{t.booking.years}
            </p>

            {/* Mode Toggle */}
            <label className="text-[13px] text-ink-2 font-medium block mb-2">{t.booking.modeLabel}</label>
            <div className="flex gap-2 mb-5">
              {(['online', 'offline'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 border rounded-xl py-3 text-[13.5px] flex items-center justify-center gap-2 transition-all ${
                    mode === m
                      ? 'bg-sage text-white border-sage'
                      : 'bg-white border-cream-2 text-ink-2 hover:border-sage/50'
                  }`}
                >
                  {m === 'online' ? t.booking.online : t.booking.offline}
                </button>
              ))}
            </div>

            {/* Time Slots */}
            <label className="text-[13px] text-ink-2 font-medium block mb-2">{t.booking.timeLabel}</label>
            <div className="grid grid-cols-4 gap-2 mb-6">
              {slots.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedTime(s)}
                  className={`border rounded-xl py-2.5 text-[12.5px] text-center transition-all ${
                    selectedTime === s
                      ? 'bg-ink-2 text-cream border-ink-2'
                      : 'bg-white border-cream-2 text-ink-2 hover:border-sage/50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <button
              onClick={confirmBooking}
              className="w-full bg-clay text-white text-[14px] rounded-full py-3.5 hover:brightness-105 transition-all font-medium"
            >
              {t.booking.confirmBtn}
            </button>
            <p className="text-center text-[12px] text-mut mt-3">{t.booking.confirmNote}</p>
          </div>
        </div>
      )}
    </>
  )
}
