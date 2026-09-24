import { useStore } from '../../viewer/state/sceneStore'
import { useLang, t } from '../i18n/strings'
import type { QuizResult } from '../quiz/types'

interface Props {
  onReset: () => void
  onQuiz: () => void
  onStudy: () => void
  best: QuizResult | null
}

export function Toolbar({ onReset, onQuiz, onStudy, best }: Props) {
  const lang = useLang()
  const setLang = useStore((s) => s.setLang)

  return (
    <header className="h-14 shrink-0 sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white/90 backdrop-blur px-4">
      <div className="flex items-center gap-2">
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-500" aria-hidden />
        <h1 className="text-sm font-bold tracking-tight">
          {t(lang, 'app.title')}{' '}
          <span className="font-normal text-gray-400">• {t(lang, 'app.subtitle')}</span>
        </h1>
      </div>
      <div className="flex items-center gap-2">
        {best && (
          <span className="hidden sm:inline rounded-full bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs font-medium text-amber-800">
            {t(lang, 'toolbar.best')}: {best.score}/{best.total}
          </span>
        )}
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
              className={`px-2.5 py-1.5 uppercase ${
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
          className="text-sm font-medium px-3.5 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 active:bg-gray-200"
        >
          {t(lang, 'toolbar.study')}
        </button>
        <button
          type="button"
          onClick={onQuiz}
          className="text-sm font-medium px-3.5 py-1.5 rounded-lg bg-gray-900 text-white hover:bg-gray-700 active:bg-gray-800"
        >
          {t(lang, 'toolbar.quiz')}
        </button>
        <button
          type="button"
          onClick={onReset}
          className="text-sm px-3.5 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 active:bg-gray-200"
        >
          {t(lang, 'toolbar.reset')}
        </button>
      </div>
    </header>
  )
}
