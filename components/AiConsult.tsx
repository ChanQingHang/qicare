'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLang } from '@/lib/i18n'

interface TongueResult {
  tongueColor: string
  tongueShape: string
  coating: string
  constitution: string
  suggestions: string[]
}

interface ChatMessage {
  role: 'user' | 'bot'
  content: string
}

const SectionReveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })
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

// Render structured Markdown: **bold** + newlines
function BotMessage({ content }: { content: string }) {
  const lines = content.split('\n')
  return (
    <div className="space-y-0.5">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-2" />
        const parts = line.split(/(\*\*[^*]+\*\*)/)
        const isHeader = line.startsWith('**') && line.includes('**', 2)
        return (
          <p key={i} className={isHeader ? 'font-semibold text-ink mt-2 mb-0.5 text-[13px]' : 'text-[13px]'}>
            {parts.map((part, j) =>
              part.startsWith('**') && part.endsWith('**') ? (
                <strong key={j} className="font-semibold text-ink">
                  {part.slice(2, -2)}
                </strong>
              ) : (
                <span key={j}>{part}</span>
              )
            )}
          </p>
        )
      })}
    </div>
  )
}

export default function AiConsult() {
  const { t, lang } = useLang()

  // Scan state
  const [preview, setPreview] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<TongueResult | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'bot', content: t.ai.chatWelcome },
  ])
  const [input, setInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
    setResult(null)
    // Reset input so the same file can be re-selected
    e.target.value = ''
  }

  const runAnalysis = async () => {
    if (!preview) return
    setScanning(true)
    try {
      const base64 = preview.split(',')[1]
      const mimeType = preview.split(';')[0].split(':')[1]
      const res = await fetch('/api/ai-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64, mimeType, lang }),
      })
      const data = await res.json()
      setResult(data)
    } catch {
      setResult({
        tongueColor: lang === 'zh' ? '舌淡红（初步参考）' : 'Pale-red tongue (indicative)',
        tongueShape: lang === 'zh' ? '舌形基本正常' : 'Generally normal shape',
        coating: lang === 'zh' ? '苔薄白略腻' : 'Thin white slightly greasy coating',
        constitution: lang === 'zh' ? '脾虚湿盛（需复诊确认）' : 'Possible Spleen Qi Deficiency with Dampness (confirm with doctor)',
        suggestions: lang === 'zh'
          ? [
              '🌿 以上仅为初步参考，不构成诊断，建议预约医师复诊确认',
              '🍵 健脾祛湿：清淡饮食，少食生冷油腻，可用薏米赤小豆调理',
              '📋 推荐方向：参苓白术散，具体用药请咨询持牌中医师',
            ]
          : [
              '🌿 This is a preliminary reference only, not a diagnosis — please consult a doctor',
              '🍵 Strengthen Spleen: Avoid cold & greasy foods; barley and red bean tea may help',
              '📋 Suggested direction: Shen Ling Bai Zhu San — confirm with a licensed TCM doctor',
            ],
      })
    } finally {
      setScanning(false)
    }
  }

  const sendMessage = useCallback(async () => {
    const text = input.trim()
    if (!text || chatLoading) return
    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    setInput('')
    setChatLoading(true)
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, lang }),
      })
      const data = await res.json()
      setMessages([...newMessages, { role: 'bot', content: data.reply }])
    } catch {
      setMessages([
        ...newMessages,
        {
          role: 'bot',
          content: lang === 'zh'
            ? '抱歉，暂时无法连接 AI 服务，请稍后再试。'
            : 'Sorry, AI service is unavailable. Please try again later.',
        },
      ])
    } finally {
      setChatLoading(false)
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    }
  }, [input, messages, chatLoading, lang])

  return (
    <section id="ai" className="py-24 bg-paper">
      <div className="max-w-[1180px] mx-auto px-7">
        <SectionReveal>
          <div className="text-center max-w-[600px] mx-auto mb-14">
            <div className="inline-flex items-center gap-2 text-[12px] tracking-widest uppercase text-clay mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-clay animate-pulse-dot" />
              {t.ai.eyebrow}
            </div>
            <h2 className="font-serif text-[clamp(28px,4vw,44px)] text-ink">{t.ai.title}</h2>
            <p className="mt-4 text-[16px] text-ink-2/75 font-light">{t.ai.sub}</p>
          </div>
        </SectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Scanner Card */}
          <SectionReveal delay={0.1}>
            <div className="bg-ink rounded-[28px] p-7 flex flex-col min-h-[500px]">
              <h3 className="font-serif text-[20px] text-cream mb-1">{t.ai.scanTitle}</h3>
              <p className="text-[13px] text-cream/55 mb-5">{t.ai.scanDesc}</p>

              {/* Upload Area */}
              <div
                className={`flex-1 rounded-[20px] border-2 border-dashed flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-300 relative overflow-hidden ${
                  scanning ? 'border-sage-l/80' : 'border-sage-l/30 hover:border-sage-l/60'
                }`}
                onClick={() => !preview && fileRef.current?.click()}
              >
                {scanning && (
                  <div className="absolute left-[6%] right-[6%] h-[2px] bg-sage-l shadow-[0_0_12px_3px_#95D5B2] animate-scanline" />
                )}

                {!preview && !result && (
                  <div className="flex flex-col items-center gap-3 text-center px-6">
                    <div
                      className="w-24 h-[76px] rounded-[50%_50%_42%_42%/60%_60%_40%_40%]"
                      style={{
                        background: 'linear-gradient(160deg, #E8B4A8, #D2786B)',
                        boxShadow: 'inset 0 -8px 16px rgba(0,0,0,0.12)',
                      }}
                    />
                    <p className="text-[13px] text-cream/65">{t.ai.scanHint}</p>
                  </div>
                )}

                {preview && !result && (
                  <div className="relative w-full h-full flex items-center justify-center p-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={preview}
                      alt="Tongue preview"
                      className="max-h-[260px] rounded-xl object-contain"
                    />
                  </div>
                )}

                {result && (
                  <div className="animate-fadein w-full p-5">
                    <div className="text-[11.5px] text-cream/50 mb-2 italic">{t.ai.resultTitle}</div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {[result.tongueColor, result.tongueShape, result.coating, result.constitution].map((tag) => (
                        <span
                          key={tag}
                          className="bg-sage-l/12 text-sage-l border border-sage-l/25 text-[11.5px] px-3 py-1 rounded-full leading-snug"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    {result.suggestions.map((s, i) => (
                      <div key={i} className="flex gap-2 text-[13px] text-cream/80 my-1.5 leading-relaxed">
                        <span className="text-sage-l flex-shrink-0 mt-0.5">▸</span>
                        {s}
                      </div>
                    ))}
                    <button
                      onClick={() => document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' })}
                      className="mt-4 w-full bg-gold text-ink text-[13.5px] rounded-full py-3 font-medium hover:brightness-105 transition-all"
                    >
                      {t.ai.bookCta}
                    </button>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 mt-4">
                {!result && (
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="flex-1 bg-white/10 text-cream text-[13px] rounded-full py-2.5 hover:bg-white/15 transition-colors border border-white/10"
                  >
                    {preview ? t.ai.retake : (lang === 'zh' ? '上传照片' : 'Upload Photo')}
                  </button>
                )}
                {preview && !result && !scanning && (
                  <button
                    onClick={runAnalysis}
                    className="flex-1 bg-sage text-white text-[13px] rounded-full py-2.5 hover:bg-sage/90 transition-colors"
                  >
                    {t.ai.scanBtn}
                  </button>
                )}
                {scanning && (
                  <div className="flex-1 flex items-center justify-center gap-2 text-sage-l text-[13px]">
                    <span className="w-4 h-4 rounded-full border-2 border-sage-l border-t-transparent animate-spin-slow" />
                    {t.ai.scanning}
                  </div>
                )}
                {result && (
                  <button
                    onClick={() => { setPreview(null); setResult(null) }}
                    className="flex-1 bg-white/10 text-cream text-[13px] rounded-full py-2.5 hover:bg-white/15 transition-colors"
                  >
                    {t.ai.retake}
                  </button>
                )}
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>
          </SectionReveal>

          {/* Chat Card */}
          <SectionReveal delay={0.2}>
            <div className="bg-cream rounded-[28px] p-7 flex flex-col min-h-[500px] border border-cream-2">
              <h3 className="font-serif text-[19px] text-ink mb-4">{t.ai.chatTitle}</h3>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1 max-h-[340px]">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`max-w-[85%] px-4 py-3 rounded-2xl leading-relaxed font-light animate-fadein ${
                      m.role === 'bot'
                        ? 'bg-white border border-cream-2 self-start rounded-bl-sm text-ink-2'
                        : 'bg-ink-2 text-cream self-end rounded-br-sm text-[13.5px]'
                    }`}
                  >
                    {m.role === 'bot' ? <BotMessage content={m.content} /> : m.content}
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex items-center gap-1.5 self-start bg-white border border-cream-2 px-4 py-3 rounded-2xl rounded-bl-sm">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-mut animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Disclaimer */}
              <p className="text-[11px] text-mut/70 mt-3 leading-relaxed">
                {lang === 'zh'
                  ? '⚠️ AI 建议仅供健康参考，不构成医疗诊断。如有严重症状请就医。'
                  : '⚠️ AI guidance is for wellness reference only, not medical diagnosis.'}
              </p>

              {/* Input */}
              <div className="flex gap-2 mt-3">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder={t.ai.chatPlaceholder}
                  className="flex-1 border border-cream-2 bg-white rounded-full px-4 py-2.5 text-[13.5px] outline-none focus:border-sage transition-colors font-light"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || chatLoading}
                  className="w-10 h-10 rounded-full bg-ink-2 text-white flex items-center justify-center hover:bg-ink transition-colors disabled:opacity-40 flex-shrink-0"
                >
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  )
}
