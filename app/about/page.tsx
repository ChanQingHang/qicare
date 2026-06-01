'use client'

import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'
import Toast from '@/components/Toast'
import { useLang } from '@/lib/i18n'
import { motion } from 'framer-motion'

const Section = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
)

const ZH = {
  hero: '关于我们',
  heroSub: '融合千年中医智慧与现代 AI，让优质中医健康服务触达每一位马来西亚华人。',
  mission: '我们的使命',
  missionBody:
    'MYTCM（大马中医）由一群热忱于传统中医与健康科技的马来西亚年轻人创立。我们深知马来西亚华社对中医保健的需求，也看到优质、可信赖的中医资源仍然稀缺。因此，我们打造了这个平台——把 AI 问诊、持牌中医师预约和经典同仁堂中成药整合在一起，让每位用户在家就能获得有温度、有深度的中医关怀。',
  what: '我们提供什么',
  w1t: 'AI 中医问诊',
  w1b: '基于 Google Gemini AI，从中医角度分析症状，给出初步体质分析与调理建议（仅供参考，不替代诊断）。',
  w2t: '持牌中医师预约',
  w2b: '平台所有中医师均持马来西亚 T&CM Act 2016 注册执业资格，支持线上视频与线下门诊预约。',
  w3t: '同仁堂正品中成药',
  w3b: '与同仁堂合作，提供安宫牛黄丸、六味地黄丸等经典中成药，全程正品保证，马来西亚本地配送。',
  w4t: '真实病例分享',
  w4b: '持牌中医师上传脱敏临床案例，展示辨证施治思路，帮助用户了解中医、建立健康意识。',
  values: '我们的价值观',
  v1: '🌿 专业可信 — 所有医师须持执照，所有产品须正品授权',
  v2: '🤝 以人为本 — 健康建议以用户实际需求为优先',
  v3: '🔒 隐私保护 — 用户数据严格加密，绝不泄露',
  v4: '📱 便捷普惠 — 让全马华人随时随地都能获得中医支持',
  contact: '联系我们',
  contactBody: '如有任何问题或合作意向，欢迎通过以下方式联系：',
  email: '邮件：qinghang7@gmail.com',
  wa: 'WhatsApp：wa.link/rhh5aw',
  addr: '地址：Johor Bahru, Johor, Malaysia',
}

const EN = {
  hero: 'About Us',
  heroSub: 'Blending centuries of TCM wisdom with modern AI to bring quality Chinese medicine to every Malaysian.',
  mission: 'Our Mission',
  missionBody:
    'MYTCM was founded by a group of Malaysian health-tech enthusiasts passionate about making Traditional Chinese Medicine more accessible. We saw a gap — quality, trustworthy TCM care remains hard to access for many Malaysians. So we built this platform to integrate AI consultation, licensed TCM doctor booking, and authentic Tongrentang products under one roof, letting every user receive thoughtful, evidence-based TCM guidance from home.',
  what: 'What We Offer',
  w1t: 'AI TCM Consultation',
  w1b: 'Powered by Google Gemini AI, our chatbot analyses your symptoms from a TCM perspective and offers preliminary constitution assessment and wellness guidance (for reference only, not a diagnosis).',
  w2t: 'Licensed TCM Doctor Booking',
  w2b: 'All doctors on our platform are registered practitioners under Malaysia\'s T&CM Act 2016, offering both online video consultations and in-clinic appointments.',
  w3t: 'Authentic Tongrentang Products',
  w3b: 'We partner with Tongrentang to offer classic formulas including An Gong Niu Huang Wan and Liu Wei Di Huang Wan — all guaranteed authentic, delivered within Malaysia.',
  w4t: 'Real Case Studies',
  w4b: 'Our licensed doctors share anonymised clinical cases to demonstrate TCM diagnostic reasoning and help users build health awareness.',
  values: 'Our Values',
  v1: '🌿 Professional & Trustworthy — All doctors are licensed; all products are authentic',
  v2: '🤝 People First — Health guidance is tailored to real user needs',
  v3: '🔒 Privacy Protected — User data is encrypted and never shared without consent',
  v4: '📱 Accessible & Inclusive — Making TCM support available to all Malaysians, anywhere',
  contact: 'Contact Us',
  contactBody: 'For enquiries or partnership opportunities, reach us at:',
  email: 'Email: qinghang7@gmail.com',
  wa: 'WhatsApp: wa.link/rhh5aw',
  addr: 'Address: Johor Bahru, Johor, Malaysia',
}

export default function AboutPage() {
  const { lang } = useLang()
  const c = lang === 'zh' ? ZH : EN

  return (
    <>
      <Nav />
      <main className="bg-paper min-h-screen">
        {/* Hero */}
        <section className="bg-ink pt-32 pb-20">
          <div className="max-w-[860px] mx-auto px-7 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 text-[11.5px] tracking-widest uppercase text-sage-l mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-sage-l" />
                MYTCM
              </div>
              <h1 className="font-serif text-[clamp(36px,5vw,60px)] text-cream mb-5 leading-tight">
                {c.hero}
              </h1>
              <p className="text-[17px] text-cream/65 font-light max-w-[560px] mx-auto leading-relaxed">
                {c.heroSub}
              </p>
            </motion.div>
          </div>
        </section>

        <div className="max-w-[800px] mx-auto px-7 py-16 space-y-16">
          {/* Mission */}
          <Section>
            <h2 className="font-serif text-[28px] text-ink mb-5">{c.mission}</h2>
            <p className="text-[16px] text-ink-2/80 font-light leading-[1.85]">{c.missionBody}</p>
          </Section>

          {/* What we offer */}
          <Section>
            <h2 className="font-serif text-[28px] text-ink mb-8">{c.what}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { t: c.w1t, b: c.w1b, icon: '💬' },
                { t: c.w2t, b: c.w2b, icon: '🏥' },
                { t: c.w3t, b: c.w3b, icon: '🌿' },
                { t: c.w4t, b: c.w4b, icon: '📋' },
              ].map((item) => (
                <div
                  key={item.t}
                  className="bg-cream border border-cream-2 rounded-2xl p-6 hover:-translate-y-0.5 transition-transform duration-300"
                >
                  <div className="text-[24px] mb-3">{item.icon}</div>
                  <h3 className="font-medium text-[16px] text-ink mb-2">{item.t}</h3>
                  <p className="text-[13.5px] text-mut font-light leading-relaxed">{item.b}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Values */}
          <Section>
            <h2 className="font-serif text-[28px] text-ink mb-6">{c.values}</h2>
            <div className="space-y-3">
              {[c.v1, c.v2, c.v3, c.v4].map((v) => (
                <div key={v} className="flex gap-3 py-3.5 border-b border-cream-2 last:border-0">
                  <p className="text-[15px] text-ink-2/80 font-light leading-relaxed">{v}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* Contact */}
          <Section>
            <div className="bg-ink rounded-[28px] p-8 text-cream">
              <h2 className="font-serif text-[26px] text-cream mb-3">{c.contact}</h2>
              <p className="text-[14px] text-cream/65 mb-5 font-light">{c.contactBody}</p>
              <div className="space-y-2.5">
                <a href="mailto:qinghang7@gmail.com" className="block text-[14px] text-sage-l hover:text-sage transition-colors">
                  {c.email}
                </a>
                <a href="https://wa.link/rhh5aw" target="_blank" rel="noopener noreferrer" className="block text-[14px] text-sage-l hover:text-sage transition-colors">
                  {c.wa}
                </a>
                <p className="text-[14px] text-cream/55">{c.addr}</p>
              </div>
            </div>
          </Section>
        </div>
      </main>
      <Footer />
      <CartDrawer />
      <Toast />
    </>
  )
}
