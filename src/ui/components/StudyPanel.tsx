import { useStore } from '../../viewer/state/sceneStore'
import {
  CHAPTER_FACTS,
  CHAPTER_FACTS_EN,
  ORGAN_META,
  ORGAN_META_EN,
  type OrganSystemId,
} from '../../viewer/atlas/atlas'
import { useLang, t } from '../i18n/strings'

const PANEL_CLASS =
  'w-full md:w-72 shrink-0 border-t md:border-t-0 md:border-l border-gray-200 bg-white p-4 overflow-y-auto'

// Panel materi mode belajar: menggantikan InfoPanel saat satu bab aktif.
export function StudyPanel() {
  const lang = useLang()
  const studySystem = useStore((s) => s.studySystem) as OrganSystemId | null
  const isolatedSystem = useStore((s) => s.isolatedSystem)
  const setStudySystem = useStore((s) => s.setStudySystem)
  const setIsolatedSystem = useStore((s) => s.setIsolatedSystem)

  if (!studySystem) return null
  const meta = lang === 'en' ? ORGAN_META_EN[studySystem] : ORGAN_META[studySystem]
  const facts = lang === 'en' ? CHAPTER_FACTS_EN[studySystem] : CHAPTER_FACTS[studySystem]

  const exit = () => {
    setStudySystem(null)
    if (isolatedSystem === studySystem) setIsolatedSystem(null)
  }

  return (
    <aside className={`${PANEL_CLASS} max-h-64 md:max-h-none`}>
      <span className="inline-block rounded-full bg-gray-900 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-white">
        {t(lang, 'study.chapter')}
      </span>
      <h2 className="mt-2 text-lg font-bold tracking-tight">{meta.nama}</h2>
      <p className="mt-2 text-sm leading-relaxed text-gray-700">{meta.deskripsi}</p>
      <h3 className="mt-4 text-xs font-bold uppercase tracking-wider text-gray-400">
        {t(lang, 'study.facts')}
      </h3>
      <ul className="mt-1.5 flex flex-col gap-1.5">
        {facts.map((f) => (
          <li key={f} className="rounded-lg bg-gray-50 border border-gray-200 px-2.5 py-2 text-xs leading-relaxed text-gray-700">
            {f}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={exit}
        className="mt-3 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100"
      >
        {t(lang, 'study.exit')}
      </button>
    </aside>
  )
}
