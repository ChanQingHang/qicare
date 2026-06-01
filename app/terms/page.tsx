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

interface TermsSection {
  title: string
  body: string[]
}

const SECTIONS_ZH: TermsSection[] = [
  {
    title: '1. 服务说明',
    body: [
      'MYTCM（大马中医）是一个面向马来西亚用户的 AI 中医健康平台，提供以下服务：AI 症状问诊参考、持牌中医师线上预约、同仁堂经典中成药电商及医师招募。',
      '使用本平台即表示您同意遵守本服务条款。若您不同意，请停止使用本平台。',
    ],
  },
  {
    title: '2. 重要医疗免责声明',
    body: [
      '⚠️ 本平台提供的所有 AI 问诊内容、产品功效描述及病例分享，均仅供健康参考，不构成医疗诊断、处方或治疗建议。',
      '如有任何健康问题，请务必咨询持牌医疗专业人员。若出现紧急医疗状况，请立即拨打 999 或前往最近的医院急诊室。',
      '中成药产品说明仅供参考。使用前请详阅产品说明书，并在有需要时咨询执照医师或药剂师。',
    ],
  },
  {
    title: '3. 用户资格与注册',
    body: [
      '• 您须年满 18 周岁方可使用本平台',
      '• 您须确保所提供的个人信息真实、准确',
      '• 您须对使用本平台账户的所有行为负责',
    ],
  },
  {
    title: '4. 知识产权',
    body: [
      '本平台所有内容（包括文字、图片、商标、AI 生成内容及代码）均为 MYTCM 或其授权方所有，受马来西亚著作权法保护。',
      '未经书面许可，不得复制、修改或商业使用本平台任何内容。',
    ],
  },
  {
    title: '5. 支付与订单条款',
    body: [
      '• 所有商品价格以马来西亚令吉（MYR）标示，含消费税（如适用）',
      '• 平台目前支持 Touch \'n Go eWallet 及银行网络转账',
      '• 订单提交后，用户须在 24 小时内完成付款并通过 WhatsApp 发送付款凭证，否则订单将自动取消',
      '• MYTCM 保留在付款确认前拒绝或取消订单的权利',
    ],
  },
  {
    title: '6. 退款与退货政策',
    body: [
      '• 如收到商品与描述不符或存在质量问题，请在收货后 7 个工作日内通过 WhatsApp 或邮件联系我们',
      '• 退货商品须保持原包装，未开封、未使用',
      '• 经核实后，我们将安排退款或换货',
      '• 因买家改变主意导致的退货，须承担来回运费',
      '• 数字服务（AI 问诊）一经使用，不予退款',
    ],
  },
  {
    title: '7. 医师入驻条款',
    body: [
      '• 申请入驻的医师须持有效马来西亚 T&CM Act 2016 注册执照',
      '• MYTCM 有权对申请资质进行审核，并保留拒绝申请的权利',
      '• 入驻医师须遵守马来西亚医师执业道德准则及平台相关规范',
      '• 违反规范的医师账户将被暂停或永久封禁',
    ],
  },
  {
    title: '8. 责任限制',
    body: [
      '在法律允许的最大范围内，MYTCM 对因使用本平台内容、AI 建议或产品所导致的任何直接或间接损失不承担责任。',
      '本平台的 AI 建议基于用户输入内容生成，准确性无法保证。用户须对自身健康决策承担最终责任。',
    ],
  },
  {
    title: '9. 服务变更与终止',
    body: [
      'MYTCM 保留随时修改、暂停或终止本平台任何服务的权利，恕不另行通知。',
      '我们也有权因用户违反本条款而暂停或终止其账户访问权限。',
    ],
  },
  {
    title: '10. 适用法律',
    body: [
      '本服务条款受马来西亚法律管辖。如发生争议，双方应首先通过协商解决；协商不成，提交马来西亚有管辖权的法院处理。',
      '本条款最后更新日期：2026 年 6 月 1 日',
    ],
  },
  {
    title: '11. 联系我们',
    body: [
      '如对本服务条款有任何疑问，请联系：',
      '📧 邮件：qinghang7@gmail.com',
      '💬 WhatsApp：wa.link/rhh5aw',
      '📍 地址：Johor Bahru, Johor, Malaysia',
    ],
  },
]

const SECTIONS_EN: TermsSection[] = [
  {
    title: '1. Service Description',
    body: [
      'MYTCM is a Malaysian AI-powered TCM health platform offering: AI symptom consultation reference, licensed TCM doctor appointment booking, Tongrentang authentic TCM product e-commerce, and doctor recruitment.',
      'By using this platform, you agree to be bound by these Terms of Service. If you do not agree, please discontinue use.',
    ],
  },
  {
    title: '2. Important Medical Disclaimer',
    body: [
      '⚠️ All AI consultation content, product descriptions, and case studies on this platform are for general wellness reference only and do not constitute medical diagnosis, prescription, or treatment advice.',
      'For any health concerns, please consult a licensed healthcare professional. In a medical emergency, call 999 or visit your nearest hospital emergency department immediately.',
      'TCM product information is for reference only. Please read the product leaflet carefully before use and consult a licensed doctor or pharmacist where necessary.',
    ],
  },
  {
    title: '3. Eligibility & Registration',
    body: [
      '• You must be at least 18 years of age to use this platform',
      '• You must ensure all personal information provided is accurate and truthful',
      '• You are responsible for all activity conducted under your account',
    ],
  },
  {
    title: '4. Intellectual Property',
    body: [
      'All content on this platform — including text, images, trademarks, AI-generated content, and code — is owned by MYTCM or its licensors and is protected under Malaysian copyright law.',
      'No content may be reproduced, modified, or used commercially without prior written permission.',
    ],
  },
  {
    title: '5. Payment & Order Terms',
    body: [
      '• All product prices are listed in Malaysian Ringgit (MYR), inclusive of applicable taxes',
      '• Accepted payment methods: Touch \'n Go eWallet and online bank transfer',
      '• Orders must be paid within 24 hours of placement and confirmed via WhatsApp with a payment screenshot; unpaid orders will be cancelled automatically',
      '• MYTCM reserves the right to reject or cancel any order prior to payment confirmation',
    ],
  },
  {
    title: '6. Refund & Return Policy',
    body: [
      '• For items received not as described or with quality issues, contact us within 7 business days of receipt via WhatsApp or email',
      '• Returned items must be in original packaging, unopened and unused',
      '• Upon verification, we will arrange a refund or exchange',
      '• Returns due to change of mind are subject to return shipping costs',
      '• Digital services (AI consultations), once used, are non-refundable',
    ],
  },
  {
    title: '7. Doctor Onboarding Terms',
    body: [
      '• Applicants must hold a valid Malaysian TCM practitioner licence under the T&CM Act 2016',
      '• MYTCM reserves the right to review credentials and reject applications',
      '• Onboarded doctors must comply with Malaysian medical ethics guidelines and platform rules',
      '• Accounts found in violation of these rules may be suspended or permanently banned',
    ],
  },
  {
    title: '8. Limitation of Liability',
    body: [
      'To the fullest extent permitted by law, MYTCM is not liable for any direct or indirect loss arising from the use of platform content, AI recommendations, or products.',
      'AI recommendations are generated based on user-provided input and cannot be guaranteed for accuracy. Users bear ultimate responsibility for their own health decisions.',
    ],
  },
  {
    title: '9. Service Changes & Termination',
    body: [
      'MYTCM reserves the right to modify, suspend, or discontinue any service at any time without notice.',
      'We also reserve the right to suspend or terminate user access for violations of these Terms.',
    ],
  },
  {
    title: '10. Governing Law',
    body: [
      'These Terms are governed by the laws of Malaysia. Disputes shall first be resolved through negotiation; failing that, they shall be submitted to a court of competent jurisdiction in Malaysia.',
      'Last updated: 1 June 2026',
    ],
  },
  {
    title: '11. Contact Us',
    body: [
      'For any questions about these Terms, please contact:',
      '📧 Email: qinghang7@gmail.com',
      '💬 WhatsApp: wa.link/rhh5aw',
      '📍 Address: Johor Bahru, Johor, Malaysia',
    ],
  },
]

export default function TermsPage() {
  const { lang } = useLang()
  const sections = lang === 'zh' ? SECTIONS_ZH : SECTIONS_EN
  const title = lang === 'zh' ? '服务条款' : 'Terms of Service'
  const sub =
    lang === 'zh'
      ? '请仔细阅读以下条款。使用本平台即表示您同意以下条款与细则。'
      : 'Please read these terms carefully. Use of this platform constitutes acceptance of the following terms.'

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
                    <p key={i} className={`text-[14.5px] font-light leading-[1.85] ${line.startsWith('⚠️') ? 'text-clay font-medium' : 'text-ink-2/75'}`}>
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
