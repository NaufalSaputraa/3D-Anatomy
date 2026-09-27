import { useEffect } from 'react'
import { useLang, t } from '../i18n/strings'

const SEEN_KEY = 'anatomy-hints-v1'

export function hasSeenHints(): boolean {
  try {
    return localStorage.getItem(SEEN_KEY) === 'seen'
  } catch {
    return true
  }
}

export function markHintsSeen(): void {
  try {
    localStorage.setItem(SEEN_KEY, 'seen')
  } catch {
    // abaikan
  }
}

const HINT_KEYS = ['hints.rotate', 'hints.pan', 'hints.zoom', 'hints.tap'] as const

// Kartu petunjuk kontrol 3D: tampil saat pertama kali (atau via tombol ?),
// tertutup manual atau otomatis setelah 12 detik.
export function ControlHints({ onClose }: { onClose: () => void }) {
  const lang = useLang()

  useEffect(() => {
    const id = setTimeout(onClose, 12000)
    return () => clearTimeout(id)
  }, [onClose])

  return (
    <div className="absolute bottom-3 left-1/2 z-20 w-max max-w-[calc(100%-1.5rem)] -translate-x-1/2 rounded-xl border border-gray-200 bg-white/95 px-4 py-3 shadow-lg backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
          {t(lang, 'hints.title')}
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label={t(lang, 'common.close')}
          className="text-gray-400 hover:text-gray-700 text-sm leading-none"
        >
          ✕
        </button>
      </div>
      <ul className="mt-1.5 flex flex-col gap-0.5 text-xs text-gray-700">
        {HINT_KEYS.map((k) => (
          <li key={k}>{t(lang, k)}</li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onClose}
        className="mt-2 w-full rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-700"
      >
        {t(lang, 'hints.gotit')}
      </button>
    </div>
  )
}
