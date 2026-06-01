'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import zh, { type Translations } from '@/locales/zh'
import en from '@/locales/en'

type Lang = 'zh' | 'en'

interface LangContextType {
  lang: Lang
  t: Translations
  setLang: (l: Lang) => void
}

const LangContext = createContext<LangContextType>({
  lang: 'zh',
  t: zh,
  setLang: () => {},
})

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('zh')
  const t = lang === 'zh' ? zh : en

  return (
    <LangContext.Provider value={{ lang, t, setLang }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)
