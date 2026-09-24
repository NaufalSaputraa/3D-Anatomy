import { useEffect, useState } from 'react'
import {
  ORGAN_META,
  ORGAN_META_EN,
  ORGAN_SYSTEMS,
  fetchAtlas,
  type OrganSystemId,
} from '../../viewer/atlas/atlas'
import { useLang, t } from '../i18n/strings'
import { loadBest } from '../quiz/storage'

interface Props {
  onClose: () => void
  onPick: (system: OrganSystemId) => void
}

// Daftar 14 bab belajar (satu per sistem organ). Jumlah part diambil dari
// atlas (cache); bila offline, daftar tetap tampil tanpa angka.
export function ChapterModal({ onClose, onPick }: Props) {
  const lang = useLang()
  const [counts, setCounts] = useState<Record<string, number> | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchAtlas()
      .then((atlas) => {
        if (cancelled) return
        const map: Record<string, number> = {}
        for (const p of atlas.parts) map[p.system] = (map[p.system] ?? 0) + 1
        setCounts(map)
      })
      .catch(() => {
        if (!cancelled) setCounts({})
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight">{t(lang, 'study.title')}</h2>
            <p className="text-xs text-gray-500">{t(lang, 'study.sub')}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-100"
          >
            {t(lang, 'quiz.close')}
          </button>
        </div>
        <div className="mt-3 flex flex-col gap-1.5 overflow-y-auto pr-1">
          {ORGAN_SYSTEMS.map((sys) => {
            const meta = lang === 'en' ? ORGAN_META_EN[sys] : ORGAN_META[sys]
            const best = loadBest(sys)
            const count = counts?.[sys]
            return (
              <button
                key={sys}
                type="button"
                onClick={() => onPick(sys)}
                className="flex items-center gap-3 rounded-xl border border-gray-200 px-3 py-2.5 text-left hover:border-gray-900 hover:bg-gray-50 transition-colors"
              >
                <span
                  className="inline-block h-4 w-4 shrink-0 rounded-full border border-black/10"
                  style={{ backgroundColor: ORGAN_META[sys].color }}
                  aria-hidden
                />
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-semibold leading-tight">{meta.nama}</span>
                  <span className="block text-[11px] text-gray-500 leading-tight">
                    {count === undefined
                      ? t(lang, 'study.loading')
                      : count > 0
                        ? `${count} ${t(lang, 'study.structures')}`
                        : t(lang, 'study.needNet')}
                    {best ? ` • ${t(lang, 'toolbar.best')} ${best.score}/${best.total}` : ''}
                  </span>
                </span>
                <span className="text-gray-400" aria-hidden>
                  ›
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
