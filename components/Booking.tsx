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
  tags: string[]
  tagsEn: string[]
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
    tags: ['脾胃虚弱', '消化调理', '气虚体质'],
    tagsEn: ['Spleen Deficiency', 'Digestive Health', 'Qi Deficiency'],
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
    tags: ['月经调理', '妇科疾病', '养颜美容'],
    tagsEn: ['Menstrual Health', "Women's Conditions", 'Skin & Beauty'],
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
    tags: ['针灸推拿', '颈肩疼痛', '腰腿调理'],
    tagsEn: ['Acupuncture', 'Neck & Shoulder', 'Back & Leg Pain'],
  },
]

const MORNING_TIMES = ['09:00', '10:30', '11:30']
const AFTERNOON_TIMES = ['14:00', '15:30', '17:00']

function getDateInfos(t: {
  booking: {
    dateToday: string
    dateTomorrow: string
    dateDayAfter: string
  }
}) {
  const now = new Date()
  return [0, 1, 2].map((offset) => {
    const d = new Date(now)
    d.setDate(now.getDate() + offset)
    const labels = [t.booking.dateToday, t.booking.dateTomorrow, t.booking.dateDayAfter]
    return {
      offset,
      label: labels[offset],
      month: d.getMonth() + 1,
      day: d.getDate(),
      dateObj: d,
    }
  })
}

function formatBookingDate(dateObj: Date, lang: string) {
  if (lang === 'zh') {
    return `${dateObj.getMonth() + 1}月${dateObj.getDate()}日`
  }
  return dateObj.toLocaleDateString('en-MY', { day: 'numeric', month: 'long' })
}

export default function Booking() {
  const { t, lang } = useLang()
  const showToast = useStore((s) => s.showToast)

  const [selectedDoc, setSelectedDoc] = useState<Doctor | null>(null)
  const [mode, setMode] = useState<'online' | 'offline'>('online')
  const [selectedDateIdx, setSelectedDateIdx] = useState(0)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const dateInfos = getDateInfos(t)

  const openModal = (doc: Doctor) => {
    setSelectedDoc(doc)
    setMode('online')
    setSelectedDateIdx(0)
    setSelectedTime(null)
  }

  const handleDateTab = (idx: number) => {
    setSelectedDateIdx(idx)
    setSelectedTime(null)
  }

  const confirmBooking = () => {
    if (!selectedTime || !selectedDoc) {
      showToast(t.booking.selectTime)
      return
    }

    const docName = lang === 'zh' ? selectedDoc.name : selectedDoc.nameEn
    const modeLabel =
      mode === 'online'
        ? t.booking.online.replace('📹 ', '')
        : t.booking.offline.replace('🏥 ', '')
    const dateInfo = dateInfos[selectedDateIdx]
    const dateStr = formatBookingDate(dateInfo.dateObj, lang)
    const period =
      parseInt(selectedTime) < 12
        ? t.booking.morning
        : t.booking.afternoon

    const msg =
      lang === 'zh'
        ? `您好，我想通过 MYTCM 平台预约【${docName}】的${modeLabel}问诊。\n时间：${dateStr} ${period} ${selectedTime}\n烦请确认，谢谢！`
        : `Hi, I'd like to book a ${modeLabel} consultation with ${docName} via MYTCM.\nDate & Time: ${dateStr} (${period}) ${selectedTime}\nPlease confirm, thank you!`

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
                <div className="bg-paper rounded-[24px] overflow-hidden hover:-translate-y-1.5 transition-transform duration-300 cursor-pointer shadow-card group">
                  {/* Photo */}
                  <div className="h-[200px] relative" style={{ background: doc.gradient }}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center font-serif text-[30px] text-white">
                        {(lang === 'zh' ? doc.name : doc.nameEn).charAt(lang === 'zh' ? 0 : 3)}
                      </div>
                    </div>
                    {/* Rating badge */}
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1">
                      <span className="text-gold text-[12px]">★</span>
                      <span className="text-white text-[12px] font-medium">{doc.rating}</span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <h3 className="font-serif text-[18px] text-ink mb-0.5">
                      {lang === 'zh' ? doc.name : doc.nameEn}
                    </h3>
                    <div className="text-[13px] text-clay mb-3">
                      {lang === 'zh' ? doc.spec : doc.specEn}
                      <span className="text-mut ml-2">
                        · {doc.years}{t.booking.years}
                      </span>
                    </div>

                    {/* Specialty tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {(lang === 'zh' ? doc.tags : doc.tagsEn).map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] bg-cream text-ink-2/70 px-2.5 py-0.5 rounded-full border border-cream-2"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2 mb-4">
                      <span className="text-[11.5px] bg-ink-2/8 text-ink-2 px-3 py-1 rounded-full">
                        {t.booking.online}
                      </span>
                      <span className="text-[11.5px] bg-ink-2/8 text-ink-2 px-3 py-1 rounded-full">
                        {t.booking.offline}
                      </span>
                    </div>

                    <button
                      onClick={() => openModal(doc)}
                      className="w-full bg-ink text-cream text-[13.5px] rounded-full py-2.5 hover:bg-ink-2 transition-colors group-hover:bg-ink-2"
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
          <div className="bg-paper rounded-[28px] w-full max-w-[500px] max-h-[90vh] overflow-y-auto p-8 relative shadow-modal animate-fadein">
            <button
              onClick={() => setSelectedDoc(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-cream-2 flex items-center justify-center text-ink-2 hover:bg-cream text-[18px]"
            >
              ✕
            </button>

            <h3 className="font-serif text-[21px] text-ink mb-0.5 pr-8">
              {t.booking.modalTitle} · {lang === 'zh' ? selectedDoc.name : selectedDoc.nameEn}
            </h3>
            <p className="text-[13px] text-mut mb-6">
              {lang === 'zh' ? selectedDoc.spec : selectedDoc.specEn}
            </p>

            {/* Mode toggle */}
            <label className="text-[12.5px] text-ink-2/70 font-medium block mb-2 uppercase tracking-wider">
              {t.booking.modeLabel}
            </label>
            <div className="flex gap-2 mb-6">
              {(['online', 'offline'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 border rounded-xl py-3 text-[13.5px] flex items-center justify-center gap-2 transition-all ${
                    mode === m
                      ? 'bg-sage text-white border-sage shadow-sm'
                      : 'bg-white border-cream-2 text-ink-2 hover:border-sage/50'
                  }`}
                >
                  {m === 'online' ? t.booking.online : t.booking.offline}
                </button>
              ))}
            </div>

            {/* Date tabs */}
            <label className="text-[12.5px] text-ink-2/70 font-medium block mb-2 uppercase tracking-wider">
              {t.booking.dateLabel}
            </label>
            <div className="flex gap-2 mb-5">
              {dateInfos.map((info) => (
                <button
                  key={info.offset}
                  onClick={() => handleDateTab(info.offset)}
                  className={`flex-1 border rounded-xl py-2.5 flex flex-col items-center transition-all ${
                    selectedDateIdx === info.offset
                      ? 'bg-ink-2 text-cream border-ink-2'
                      : 'bg-white border-cream-2 text-ink-2 hover:border-sage/50'
                  }`}
                >
                  <span className="text-[13px] font-medium">{info.label}</span>
                  <span className="text-[10.5px] opacity-60 mt-0.5">{info.month}/{info.day}</span>
                </button>
              ))}
            </div>

            {/* Time slots */}
            <label className="text-[12.5px] text-ink-2/70 font-medium block mb-3 uppercase tracking-wider">
              {t.booking.timeLabel}
            </label>

            {/* Morning */}
            <div className="mb-4">
              <div className="text-[11.5px] text-mut mb-2 flex items-center gap-1.5">
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
                {t.booking.morning}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {MORNING_TIMES.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`border rounded-xl py-2.5 text-[13px] text-center transition-all ${
                      selectedTime === time
                        ? 'bg-ink-2 text-cream border-ink-2 font-medium'
                        : 'bg-white border-cream-2 text-ink-2 hover:border-sage/50'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Afternoon */}
            <div className="mb-7">
              <div className="text-[11.5px] text-mut mb-2 flex items-center gap-1.5">
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M17 18a5 5 0 00-10 0" />
                  <line x1="12" y1="9" x2="12" y2="2" />
                  <line x1="4.22" y1="10.22" x2="5.64" y2="11.64" />
                  <line x1="1" y1="18" x2="3" y2="18" />
                  <line x1="21" y1="18" x2="23" y2="18" />
                  <line x1="18.36" y1="11.64" x2="19.78" y2="10.22" />
                </svg>
                {t.booking.afternoon}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {AFTERNOON_TIMES.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`border rounded-xl py-2.5 text-[13px] text-center transition-all ${
                      selectedTime === time
                        ? 'bg-ink-2 text-cream border-ink-2 font-medium'
                        : 'bg-white border-cream-2 text-ink-2 hover:border-sage/50'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Confirm button */}
            <button
              onClick={confirmBooking}
              className={`w-full text-white text-[14px] rounded-full py-3.5 font-medium transition-all ${
                selectedTime
                  ? 'bg-clay hover:brightness-105 shadow-sm'
                  : 'bg-mut/30 cursor-not-allowed'
              }`}
            >
              {t.booking.confirmBtn}
            </button>
            {selectedTime && (
              <p className="text-center text-[12px] text-mut mt-3">{t.booking.confirmNote}</p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
