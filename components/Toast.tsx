'use client'

import { useStore } from '@/lib/store'

export default function Toast() {
  const toastMsg = useStore((s) => s.toastMsg)

  return (
    <div
      className={`fixed bottom-6 left-1/2 z-[100] transition-all duration-400 ${
        toastMsg
          ? '-translate-x-1/2 translate-y-0 opacity-100'
          : '-translate-x-1/2 translate-y-16 opacity-0 pointer-events-none'
      }`}
    >
      <div className="bg-ink text-cream text-[13.5px] px-5 py-3 rounded-full shadow-lg flex items-center gap-2 whitespace-nowrap">
        <span className="text-sage-l">✓</span>
        {toastMsg}
      </div>
    </div>
  )
}
