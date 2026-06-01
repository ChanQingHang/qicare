'use client'

import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'
import Toast from '@/components/Toast'
import { useLang } from '@/lib/i18n'
import { motion } from 'framer-motion'

const Reveal = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.1 }}
    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
)

interface PolicySection {
  title: string
  body: string[]
}

const SECTIONS_ZH: PolicySection[] = [
  {
    title: '1. 我们收集哪些信息',
    body: [
      '当您使用 MYTCM 平台时，我们可能收集以下信息：',
      '• 基本身份信息：姓名、联系方式（手机号码/WhatsApp）、收货地址',
      '• 健康相关信息：您在 AI 问诊中描述的症状与健康状况（用于提供问诊建议）',
      '• 订单信息：您所购买的产品、支付方式、订单状态',
      '• 医师申请信息：姓名、执照号码、执业背景（仅适用于申请入驻的医师）',
      '• 技术信息：浏览器类型、IP 地址、访问时间（用于平台安全与性能优化）',
    ],
  },
  {
    title: '2. 我们如何使用您的信息',
    body: [
      '我们收集的信息仅用于以下目的：',
      '• 提供 AI 问诊服务（健康描述将传输至 Google Gemini API 进行处理）',
      '• 处理您的购物订单与配送安排',
      '• 协助医师预约及 WhatsApp 沟通',
      '• 审核医师入驻申请',
      '• 改善平台功能与用户体验',
      '我们不会将您的个人信息用于上述目的以外的任何商业行为。',
    ],
  },
  {
    title: '3. 信息共享与第三方',
    body: [
      '我们在以下有限情形下可能共享您的信息：',
      '• Supabase（数据库服务）：用于安全存储订单与医师申请数据',
      '• Google LLC（AI 服务）：AI 问诊内容将通过 Gemini API 处理，请勿在问诊中填写极度敏感的个人信息',
      '• 执行法律义务：若依马来西亚法律要求，我们可能须向相关执法机构披露信息',
      '我们不会将您的信息出售给任何第三方。',
    ],
  },
  {
    title: '4. 数据安全',
    body: [
      '我们采取合理的技术和管理措施保护您的个人信息，包括：',
      '• 使用 HTTPS 加密传输',
      '• Supabase Row Level Security (RLS) 访问控制',
      '• 定期安全审查',
      '然而，互联网传输并非 100% 安全。如您认为个人信息遭到泄露，请立即联系我们。',
    ],
  },
  {
    title: '5. Cookie 与追踪技术',
    body: [
      '本平台可能使用基本的浏览器 Cookie 以维持会话状态。我们不使用第三方广告追踪 Cookie。您可在浏览器设置中管理或禁用 Cookie，但这可能影响部分功能的正常使用。',
    ],
  },
  {
    title: '6. 您的权利',
    body: [
      '根据马来西亚《个人数据保护法 2010》（PDPA），您有权：',
      '• 查询我们持有的关于您的个人数据',
      '• 要求更正不准确的信息',
      '• 在特定情形下要求删除您的数据',
      '如需行使上述权利，请发送邮件至 qinghang7@gmail.com。',
    ],
  },
  {
    title: '7. 未成年人保护',
    body: [
      '本平台不面向 18 岁以下未成年人提供服务。若您发现未成年人向我们提供了个人信息，请联系我们予以删除。',
    ],
  },
  {
    title: '8. 隐私政策变更',
    body: [
      '我们可能不定期更新本隐私政策。重大变更将在平台上发布通知。继续使用本平台即视为您接受更新后的政策。',
      '本政策最后更新日期：2026 年 6 月 1 日',
    ],
  },
  {
    title: '9. 联系我们',
    body: [
      '如对本隐私政策有任何疑问，请通过以下方式联系：',
      '📧 邮件：qinghang7@gmail.com',
      '💬 WhatsApp：wa.link/rhh5aw',
      '📍 地址：Johor Bahru, Johor, Malaysia',
    ],
  },
]

const SECTIONS_EN: PolicySection[] = [
  {
    title: '1. Information We Collect',
    body: [
      'When you use the MYTCM platform, we may collect the following information:',
      '• Personal identification: full name, contact number (mobile/WhatsApp), delivery address',
      '• Health-related information: symptoms and conditions you describe during AI consultations (used to provide wellness guidance)',
      '• Order information: products purchased, payment method, order status',
      '• Doctor application information: name, licence number, professional background (for doctor applicants only)',
      '• Technical information: browser type, IP address, access time (for platform security and performance)',
    ],
  },
  {
    title: '2. How We Use Your Information',
    body: [
      'Information collected is used solely for the following purposes:',
      '• Providing AI consultation services (health descriptions are sent to Google Gemini API for processing)',
      '• Processing your orders and arranging delivery',
      '• Facilitating doctor appointments and WhatsApp communication',
      '• Reviewing doctor applications',
      '• Improving platform features and user experience',
      'We do not use your personal information for any commercial purpose beyond the above.',
    ],
  },
  {
    title: '3. Information Sharing & Third Parties',
    body: [
      'We may share your information in the following limited circumstances:',
      '• Supabase (database service): for secure storage of orders and applications',
      '• Google LLC (AI service): AI consultation content is processed via the Gemini API — please avoid sharing extremely sensitive personal details in consultations',
      '• Legal obligations: we may disclose information to authorities if required under Malaysian law',
      'We do not sell your information to any third party.',
    ],
  },
  {
    title: '4. Data Security',
    body: [
      'We take reasonable technical and organisational measures to protect your personal data, including:',
      '• HTTPS encrypted data transmission',
      '• Supabase Row Level Security (RLS) access controls',
      '• Regular security reviews',
      'However, no internet transmission is 100% secure. If you believe your data has been compromised, please contact us immediately.',
    ],
  },
  {
    title: '5. Cookies & Tracking',
    body: [
      'This platform may use basic browser cookies to maintain session state. We do not use third-party advertising tracking cookies. You may manage or disable cookies in your browser settings, though this may affect certain platform functionality.',
    ],
  },
  {
    title: '6. Your Rights',
    body: [
      'Under Malaysia\'s Personal Data Protection Act 2010 (PDPA), you have the right to:',
      '• Access personal data we hold about you',
      '• Request correction of inaccurate information',
      '• Request deletion of your data in certain circumstances',
      'To exercise these rights, email us at qinghang7@gmail.com.',
    ],
  },
  {
    title: '7. Children\'s Privacy',
    body: [
      'Our platform is not directed to individuals under the age of 18. If you become aware that a minor has provided us with personal information, please contact us to have it removed.',
    ],
  },
  {
    title: '8. Policy Updates',
    body: [
      'We may update this Privacy Policy from time to time. Significant changes will be announced on the platform. Continued use of the platform constitutes acceptance of the updated policy.',
      'Last updated: 1 June 2026',
    ],
  },
  {
    title: '9. Contact Us',
    body: [
      'For any questions about this Privacy Policy, please contact:',
      '📧 Email: qinghang7@gmail.com',
      '💬 WhatsApp: wa.link/rhh5aw',
      '📍 Address: Johor Bahru, Johor, Malaysia',
    ],
  },
]

export default function PrivacyPage() {
  const { lang } = useLang()
  const sections = lang === 'zh' ? SECTIONS_ZH : SECTIONS_EN
  const title = lang === 'zh' ? '隐私政策' : 'Privacy Policy'
  const sub =
    lang === 'zh'
      ? '本政策说明 MYTCM（大马中医）如何收集、使用和保护您的个人信息。'
      : 'This policy explains how MYTCM collects, uses and protects your personal information.'

  return (
    <>
      <Nav />
      <main className="bg-paper min-h-screen">
        {/* Hero */}
        <section className="bg-ink pt-32 pb-16">
          <div className="max-w-[800px] mx-auto px-7 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 text-[11.5px] tracking-widest uppercase text-sage-l mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-sage-l" />
                MYTCM
              </div>
              <h1 className="font-serif text-[clamp(32px,5vw,52px)] text-cream mb-4">{title}</h1>
              <p className="text-[15px] text-cream/60 font-light max-w-[500px] mx-auto">{sub}</p>
            </motion.div>
          </div>
        </section>

        <div className="max-w-[760px] mx-auto px-7 py-14 space-y-10">
          {sections.map((s) => (
            <Reveal key={s.title}>
              <div className="border-b border-cream-2 pb-8 last:border-0">
                <h2 className="font-serif text-[20px] text-ink mb-4">{s.title}</h2>
                <div className="space-y-2">
                  {s.body.map((line, i) => (
                    <p key={i} className="text-[14.5px] text-ink-2/75 font-light leading-[1.85]">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </main>
      <Footer />
      <CartDrawer />
      <Toast />
    </>
  )
}
