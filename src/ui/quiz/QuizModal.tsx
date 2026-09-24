import { useEffect, useMemo, useState } from 'react'
import type { Manifest } from '../../data/schema'
import { generateQuestions } from './questions'
import { buildOrganQuestions } from './organQuestions'
import { saveResult } from './storage'
import type { QuizQuestion } from './types'

interface Props {
  manifest: Manifest
  onClose: () => void
}

export function QuizModal({ manifest, onClose }: Props) {
  const [round, setRound] = useState(0)
  const [pool, setPool] = useState<QuizQuestion[] | null>(null)
  const [source, setSource] = useState<'organ' | 'dasar'>('dasar')
  const [index, setIndex] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [phase, setPhase] = useState<'loading' | 'quiz' | 'done'>('loading')

  useEffect(() => {
    let cancelled = false
    setPool(null)
    setPhase('loading')
    buildOrganQuestions(5).then((organ) => {
      if (cancelled) return
      if (organ && organ.length >= 4) {
        setPool(organ)
        setSource('organ')
      } else {
        setPool(generateQuestions(manifest, 5))
        setSource('dasar')
      }
      setPhase('quiz')
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manifest, round])

  const questions: QuizQuestion[] = useMemo(() => pool ?? [], [pool])
  const current = questions[index]
  const finished = phase === 'done'

  const pick = (choice: string) => {
    if (picked !== null || !current) return
    setPicked(choice)
    if (choice === current.answer) setScore((s) => s + 1)
  }

  const next = () => {
    if (!current) return
    if (index + 1 >= questions.length) {
      saveResult({ score, total: questions.length, date: new Date().toISOString() })
      setPhase('done')
    } else {
      setIndex((i) => i + 1)
      setPicked(null)
    }
  }

  const replay = () => {
    setIndex(0)
    setPicked(null)
    setScore(0)
    setPhase('loading')
    setRound((r) => r + 1)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
        {phase === 'loading' || !current ? (
          !finished ? (
            <>
              <h2 className="text-base font-semibold">Menyiapkan soal…</h2>
              <p className="mt-1 text-sm text-gray-500">Mengambil bank soal anatomi.</p>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-100"
                >
                  Tutup
                </button>
              </div>
            </>
          ) : null
        ) : null}
        {phase === 'quiz' && current && (
          <>
            <div className="flex items-center justify-between text-xs font-medium text-gray-500">
              <span>
                Soal {index + 1}/{questions.length}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 ${
                  source === 'organ' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {source === 'organ' ? 'Soal organ asli' : 'Soal dasar'}
              </span>
              <span>Skor: {score}</span>
            </div>
            <div
              className="mt-2 h-1.5 rounded-full bg-gray-100"
              role="progressbar"
              aria-valuenow={index + 1}
              aria-valuemin={1}
              aria-valuemax={questions.length}
            >
              <div
                className="h-full rounded-full bg-amber-500 transition-all"
                style={{ width: `${((index + 1) / questions.length) * 100}%` }}
              />
            </div>
            <h2 className="mt-2 text-base font-semibold">{current.prompt}</h2>
            <div className="mt-4 flex flex-col gap-2">
              {current.choices.map((c) => {
                const isAnswer = c === current.answer
                const isPicked = c === picked
                const cls =
                  picked === null
                    ? 'border hover:bg-gray-100'
                    : isAnswer
                      ? 'border-green-600 bg-green-50 text-green-800'
                      : isPicked
                        ? 'border-red-600 bg-red-50 text-red-800'
                        : 'border opacity-60'
                return (
                  <button
                    key={c}
                    type="button"
                    disabled={picked !== null}
                    onClick={() => pick(c)}
                    className={`rounded-lg border px-3.5 py-2.5 text-left text-sm font-medium transition-colors ${cls}`}
                  >
                    {c}
                  </button>
                )
              })}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-100"
              >
                Tutup
              </button>
              <button
                type="button"
                disabled={picked === null}
                onClick={next}
                className="rounded-lg bg-black px-3 py-1.5 text-sm text-white disabled:opacity-40"
              >
                {index + 1 >= questions.length ? 'Lihat hasil' : 'Lanjut'}
              </button>
            </div>
          </>
        )}
        {finished && (
          <>
            <h2 className="text-lg font-semibold">Hasil Kuis</h2>
            <p className="mt-2 text-3xl font-bold">
              {score}/{questions.length}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {score === questions.length
                ? 'Sempurna! Pertahankan.'
                : score >= 3
                  ? 'Bagus! Coba lagi untuk nilai sempurna.'
                  : 'Pelajari lagi strukturnya, lalu coba lagi.'}
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-100"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={replay}
                className="rounded-lg bg-black px-3 py-1.5 text-sm text-white"
              >
                Main lagi
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
