import { useStore } from '../../viewer/state/sceneStore'
import { useLang, t } from '../i18n/strings'

interface Props {
  onReset: () => void
  onStudy: () => void
}

export function Toolbar({ onReset, onStudy }: Props) {
  const lang = useLang()
  const setLang = useStore((s) => s.setLang)

  return (
    <header className="min-h-14 shrink-0 sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-gray-200 bg-white/90 backdrop-blur px-3 sm:px-4 py-2">
      <div className="flex items-center gap-2 min-w-0">
        <span className="inline-block h-2.5 w-2.5 shrink-0 rounded-full bg-amber-500" aria-hidden />
        <h1 className="text-xs sm:text-sm font-bold tracking-tight truncate">
          {t(lang, 'app.title')}{' '}
          <span className="hidden min-[420px]:inline font-normal text-gray-400">
            • {t(lang, 'app.subtitle')}
          </span>
        </h1>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <div
          className="flex rounded-lg border border-gray-300 overflow-hidden text-xs font-medium"
          role="group"
          aria-label="Language / Bahasa"
        >
          {(['id', 'en'] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              aria-pressed={lang === l}
              className={`px-2 py-1.5 uppercase ${
                lang === l ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onStudy}
          className="text-xs sm:text-sm font-medium px-2.5 sm:px-3.5 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 active:bg-gray-200"
        >
          {t(lang, 'toolbar.study')}
        </button>
        <button
          type="button"
          onClick={onReset}
          className="hidden min-[420px]:inline text-xs sm:text-sm px-2.5 sm:px-3.5 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 active:bg-gray-200"
        >
          {t(lang, 'toolbar.reset')}
        </button>
      </div>
    </header>
  )
}
