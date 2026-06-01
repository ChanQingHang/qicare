import type { Metadata, Viewport } from 'next'
import Providers from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: '岐黄云诊 QiCare · AI 中医健康平台',
  description:
    '拍张舌头照片，AI 结合中医望闻问切给出调理方案。预约持牌中医师，选购正品药材。马来西亚首选 AI 中医健康平台。',
  keywords: ['中医', 'TCM', 'AI 问诊', '舌象分析', '马来西亚中医', 'Malaysia TCM', 'QiCare'],
  authors: [{ name: 'QiCare Health' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'QiCare',
  },
  openGraph: {
    title: '岐黄云诊 QiCare · AI 中医健康平台',
    description: '把老中医装进口袋 — AI 舌象分析 + 持牌中医师预约',
    locale: 'zh_MY',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#16302A',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;600&family=Noto+Sans+SC:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
