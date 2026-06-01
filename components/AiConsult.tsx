'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLang } from '@/lib/i18n'

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

// Enhanced markdown renderer: handles **headers**, - list items, inline **bold**, and line breaks
function BotMessage({ content }: { content: string }) {
  const lines = content.split('\n')
  return (
    <div className="space-y-1 text-[13.5px] leading-relaxed">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1" />

        // List item (- or •)
        if (/^[-•]\s/.test(line)) {
          const text = line.replace(/^[-•]\s/, '')
          return (
            <div key={i} className="flex gap-2 pl-1">
              <span className="text-sage mt-[3px] flex-shrink-0 text-[10px]">●</span>
              <span>{renderInline(text)}</span>
            </div>
          )
        }

        // Numbered list (1. 2. etc.)
        const numberedMatch = line.match(/^(\d+)\.\s(.+)/)
        if (numberedMatch) {
          return (
            <div key={i} className="flex gap-2 pl-1">
              <span className="text-sage-l font-medium flex-shrink-0 w-4 text-right">{numberedMatch[1]}.</span>
              <span>{renderInline(numberedMatch[2])}</span>
            </div>
          )
        }

        // Full-line bold = section header (e.g. **识别到的问题**)
        const headerMatch = line.match(/^\*\*(.+)\*\*$/)
        if (headerMatch) {
          return (
            <p
              key={i}
              className="font-semibold text-ink text-[13.5px] mt-3.5 mb-1 pt-2.5 border-t border-cream-2 first:border-t-0 first:pt-0 first:mt-0"
            >
              {headerMatch[1]}
            </p>
          )
        }

        // Italic disclaimer (* text *)
        if (line.startsWith('*') && line.endsWith('*') && !line.startsWith('**')) {
          return (
            <p key={i} className="text-[12px] text-mut/80 italic mt-2">
              {line.slice(1, -1)}
            </p>
          )
        }

        return <p key={i}>{renderInline(line)}</p>
      })}
    </div>
  )
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return (
    <>
      {parts.map((part, j) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={j} className="font-semibold text-ink">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={j}>{part}</span>
        )
      )}
    </>
  )
}

const QUICK_PROMPTS: Record<string, string[]> = {
  zh: [
    '最近总是疲倦，该怎么调理？',
    '容易上火，有什么建议？',
    '失眠多梦，如何改善？',
    '湿气重有哪些表现？',
  ],
  en: [
    "I've been tired lately, how to improve?",
    'I tend to get heatiness, any advice?',
    'Trouble sleeping, what can help?',
    'What are signs of too much dampness?',
  ],
}

const ChatIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
)

const SendIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)

export default function AiConsult() {
  const { t, lang } = useLang()

  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'bot', content: t.ai.chatWelcome },
  ])
  const [input, setInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = useCallback(() => {
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 60)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, chatLoading, scrollToBottom])

  const sendMessage = useCallback(
    async (overrideText?: string) => {
      const text = (overrideText ?? input).trim()
      if (!text || chatLoading) return

      const newMessages: ChatMessage[] = [...messages, { role: 'user', content: text }]
      setMessages(newMessages)
      setInput('')
      setChatLoading(true)

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: newMessages, lang }),
        })

        if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`)

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let accumulated = ''
        let isFirstChunk = true

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          accumulated += decoder.decode(value, { stream: true })

          // Hide "typing" indicator on first chunk, then stream text into bot bubble
          if (isFirstChunk) {
            setChatLoading(false)
            isFirstChunk = false
          }

          setMessages([...newMessages, { role: 'bot', content: accumulated }])
        }

        // Flush any remaining bytes from the decoder
        const tail = decoder.decode()
        if (tail) {
          setMessages([...newMessages, { role: 'bot', content: accumulated + tail }])
        }
      } catch (err) {
        console.error('[chat]', err)
        setMessages([
          ...newMessages,
          {
            role: 'bot',
            content:
              lang === 'zh'
                ? '抱歉，AI 服务暂时不可用，请稍后再试。'
                : 'Sorry, AI service is temporarily unavailable. Please try again.',
          },
        ])
      } finally {
        setChatLoading(false)
        inputRef.current?.focus()
      }
    },
    [input, messages, chatLoading, lang]
  )

  const clearChat = () => {
    setMessages([{ role: 'bot', content: t.ai.chatWelcome }])
    setInput('')
    inputRef.current?.focus()
  }

  const isInitial = messages.length === 1
  const quickPrompts = QUICK_PROMPTS[lang] ?? QUICK_PROMPTS.zh

  return (
    <section id="ai" className="py-24 bg-paper">
      <div className="max-w-[1180px] mx-auto px-7">
        <SectionReveal>
          <div className="text-center max-w-[600px] mx-auto mb-12">
            <div className="inline-flex items-center gap-2 text-[12px] tracking-widest uppercase text-clay mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-clay animate-pulse-dot" />
              {t.ai.eyebrow}
            </div>
            <h2 className="font-serif text-[clamp(28px,4vw,44px)] text-ink">{t.ai.title}</h2>
            <p className="mt-4 text-[16px] text-ink-2/75 font-light">{t.ai.sub}</p>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <div className="max-w-[860px] mx-auto rounded-[32px] border border-cream-2 bg-white overflow-hidden"
            style={{ boxShadow: '0 4px 40px rgba(27,58,45,0.08)' }}
          >
            {/* Chat header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-cream-2 bg-paper">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-ink-2 flex items-center justify-center text-white flex-shrink-0">
                  <ChatIcon />
                </div>
                <div>
                  <div className="text-[14px] font-medium text-ink leading-tight">{t.ai.chatTitle}</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-sage animate-pulse-dot" />
                    <span className="text-[11.5px] text-sage font-medium">{t.ai.online}</span>
                    <span className="text-[11px] text-mut/60 ml-1">· Gemini 1.5 Flash</span>
                  </div>
                </div>
              </div>
              {messages.length > 1 && (
                <button
                  onClick={clearChat}
                  className="text-[12px] text-mut hover:text-clay transition-colors px-3 py-1.5 rounded-full hover:bg-cream-2/60"
                >
                  {t.ai.clearChat}
                </button>
              )}
            </div>

            {/* Messages area */}
            <div className="px-6 py-5 min-h-[400px] max-h-[520px] overflow-y-auto flex flex-col gap-4 bg-white">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex gap-3 animate-fadein ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {m.role === 'bot' && (
                    <div className="w-8 h-8 rounded-xl bg-ink-2 flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                      <ChatIcon />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                      m.role === 'bot'
                        ? 'bg-cream border border-cream-2/80 rounded-tl-sm text-ink-2'
                        : 'bg-ink-2 text-cream rounded-tr-sm text-[13.5px]'
                    }`}
                  >
                    {m.role === 'bot' ? <BotMessage content={m.content} /> : m.content}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {chatLoading && (
                <div className="flex gap-3 animate-fadein">
                  <div className="w-8 h-8 rounded-xl bg-ink-2 flex items-center justify-center text-white flex-shrink-0">
                    <ChatIcon />
                  </div>
                  <div className="bg-cream border border-cream-2/80 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                    <span className="text-[12px] text-mut mr-1.5">{t.ai.thinking}</span>
                    {[0, 1, 2].map((j) => (
                      <span
                        key={j}
                        className="w-1.5 h-1.5 rounded-full bg-sage/60 animate-bounce"
                        style={{ animationDelay: `${j * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Quick prompts — shown only in initial state */}
            {isInitial && (
              <div className="px-6 pt-1 pb-4 border-t border-cream-2/60 flex flex-wrap gap-2 bg-white">
                {quickPrompts.map((p) => (
                  <button
                    key={p}
                    onClick={() => sendMessage(p)}
                    className="text-[12.5px] text-ink-2/80 bg-cream border border-cream-2 rounded-full px-3.5 py-1.5 hover:border-sage/60 hover:text-ink-2 hover:bg-sage/5 transition-all duration-200"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            {/* Disclaimer + input */}
            <div className="px-6 pt-3 pb-5 border-t border-cream-2 bg-paper">
              <p className="text-[11px] text-mut/65 mb-3 leading-relaxed">
                {lang === 'zh'
                  ? '⚠️ AI 建议仅供健康参考，不构成医疗诊断。如有严重症状请立即就医。'
                  : '⚠️ AI guidance is for wellness reference only and does not constitute medical diagnosis.'}
              </p>
              <div className="flex gap-2.5">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder={t.ai.chatPlaceholder}
                  className="flex-1 border border-cream-2 bg-cream rounded-full px-5 py-3 text-[13.5px] outline-none focus:border-sage transition-colors font-light placeholder:text-mut/50"
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || chatLoading}
                  className="w-11 h-11 rounded-full bg-ink-2 text-white flex items-center justify-center hover:bg-ink transition-colors disabled:opacity-35 flex-shrink-0"
                >
                  <SendIcon />
                </button>
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}
