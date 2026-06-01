import type { Metadata, Viewport } from 'next'
import Providers from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'MYTCM 大马中医 · AI 中医健康平台',
  description:
    '马来西亚首选 AI 中医平台。拍张舌象照片，AI 结合望闻问切给出调理方案。预约持牌中医师，选购同仁堂正品中成药。',
  keywords: ['中医', 'TCM', 'MYTCM', '大马中医', 'AI 问诊', '舌象分析', '马来西亚中医', 'Malaysia TCM', '同仁堂'],
  authors: [{ name: 'MYTCM 大马中医' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MYTCM',
  },
  openGraph: {
    title: 'MYTCM 大马中医 · AI 中医健康平台',
    description: '把中医带进日常 — AI 舌象分析 + 持牌中医师预约 + 同仁堂中成药',
    locale: 'zh_MY',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#1B3A2D',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
