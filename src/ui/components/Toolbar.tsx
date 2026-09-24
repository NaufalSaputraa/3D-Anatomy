import type { QuizResult } from '../quiz/types'

interface Props {
  onReset: () => void
  onQuiz: () => void
  best: QuizResult | null
}

export function Toolbar({ onReset, onQuiz, best }: Props) {
  return (
    <header className="h-14 shrink-0 sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white/90 backdrop-blur px-4">
      <div className="flex items-center gap-2">
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-500" aria-hidden />
        <h1 className="text-sm font-bold tracking-tight">
          3D Anatomy <span className="font-normal text-gray-400">• Viewer Skeleton</span>
        </h1>
      </div>
      <div className="flex items-center gap-2">
        {best && (
          <span className="hidden sm:inline rounded-full bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs font-medium text-amber-800">
            Terbaik: {best.score}/{best.total}
          </span>
        )}
        <button
          type="button"
          onClick={onQuiz}
          className="text-sm font-medium px-3.5 py-1.5 rounded-lg bg-gray-900 text-white hover:bg-gray-700 active:bg-gray-800"
        >
          Kuis
        </button>
        <button
          type="button"
          onClick={onReset}
          className="text-sm px-3.5 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 active:bg-gray-200"
        >
          Reset
        </button>
      </div>
    </header>
  )
}
