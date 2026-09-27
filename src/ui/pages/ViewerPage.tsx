import { useEffect, useMemo, useState } from 'react'
import { AnatomyScene } from '../../viewer/components/AnatomyScene'
import { useStore } from '../../viewer/state/sceneStore'
import { ORGAN_META, ORGAN_META_EN, type OrganSystemId } from '../../viewer/atlas/atlas'
import { useLang, t } from '../i18n/strings'
import manifestData from '../../data/manifest.json'
import type { Manifest } from '../../data/schema'
import { Sidebar } from '../components/Sidebar'
import { OrganLayers } from '../components/OrganLayers'
import { InfoPanel } from '../components/InfoPanel'
import { StudyPanel } from '../components/StudyPanel'
import { ChapterModal } from '../components/ChapterModal'
import { Toolbar } from '../components/Toolbar'
import { useSearch, type OrganMatch } from '../hooks/useSearch'
import { QuizModal } from '../quiz/QuizModal'
import { loadBest } from '../quiz/storage'
import type { QuizResult } from '../quiz/types'

export function ViewerPage() {
  const lang = useLang()
  const selectedId = useStore((s) => s.selectedId)
  const selectedMesh = useStore((s) => s.selectedMesh)
  const selectedOrgan = useStore((s) => s.selectedOrgan)
  const hoverId = useStore((s) => s.hoverId)
  const visibilityMap = useStore((s) => s.visibilityMap)
  const studySystem = useStore((s) => s.studySystem)
  const setSelected = useStore((s) => s.setSelected)
  const setSelectedOrgan = useStore((s) => s.setSelectedOrgan)
  const setHover = useStore((s) => s.setHover)
  const toggleVisibility = useStore((s) => s.toggleVisibility)
  const setStudySystem = useStore((s) => s.setStudySystem)
  const setOrganEnabled = useStore((s) => s.setOrganEnabled)
  const setPendingOrganPick = useStore((s) => s.setPendingOrganPick)
  const setIsolatedSystem = useStore((s) => s.setIsolatedSystem)
  const reset = useStore((s) => s.reset)
  const resetView = useStore((s) => s.resetView)

  const handleReset = () => {
    reset()
    resetView()
  }

  const handleSelect = (id: string | null) => {
    setSelected(id)
    setSelectedOrgan(null)
  }

  const handlePickOrgan = (organ: OrganMatch) => {
    setOrganEnabled(organ.system, true)
    setPendingOrganPick({ system: organ.system, partId: organ.id })
  }

  const [quizOpen, setQuizOpen] = useState(false)
  const [leftOpen, setLeftOpen] = useState(true)
  const [chapterOpen, setChapterOpen] = useState(false)
  const [quizChapter, setQuizChapter] = useState<{ system: OrganSystemId; title: string } | null>(null)
  const [best, setBest] = useState<QuizResult | null>(() => loadBest())

  useEffect(() => {
    if (!quizOpen) {
      setBest(loadBest())
      setQuizChapter(null)
    }
  }, [quizOpen])

  const enterStudy = (sys: OrganSystemId) => {
    setStudySystem(sys)
    setOrganEnabled(sys, true)
    setIsolatedSystem(sys)
    setSelected(null)
    setSelectedOrgan(null)
    setChapterOpen(false)
  }

  const openChapterQuiz = () => {
    if (!studySystem) return
    const sys = studySystem as OrganSystemId
    const meta = lang === 'en' ? ORGAN_META_EN[sys] : ORGAN_META[sys]
    setQuizChapter({ system: sys, title: meta.nama })
    setQuizOpen(true)
  }

  const manifest = manifestData as Manifest
  const { query, setQuery, results, organs } = useSearch(manifest)
  const selected = useMemo(
    () => manifest.find((p) => p.id === selectedId) ?? null,
    [manifest, selectedId],
  )
  const selectedHidden = selected ? visibilityMap[selected.sistem] === false : false
  const isolatedSystem = useStore((s) => s.isolatedSystem)

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Toolbar
        onReset={handleReset}
        onQuiz={() => setQuizOpen(true)}
        onStudy={() => setChapterOpen(true)}
        best={best}
      />
      <div className="px-4 py-2 bg-white border-b border-gray-200 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setLeftOpen((v) => !v)}
          title={leftOpen ? t(lang, 'toolbar.panelHide') : t(lang, 'toolbar.panelShow')}
          aria-label={leftOpen ? t(lang, 'toolbar.panelHide') : t(lang, 'toolbar.panelShow')}
          className="shrink-0 rounded-lg border border-gray-300 px-2.5 py-2 text-sm leading-none hover:bg-gray-100"
        >
          {leftOpen ? '‹' : '›'}
        </button>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t(lang, 'search.placeholder')}
          className="w-full max-w-md text-sm px-3.5 py-2 rounded-lg border border-gray-300 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
        />
      </div>
      {isolatedSystem && (
        <div className="px-4 py-1.5 bg-gray-900 text-white text-xs flex items-center justify-between gap-2">
          <span className="truncate">
            {t(lang, 'isolate.mode')}:{' '}
            <span className="font-semibold">
              {isolatedSystem === 'skeletal'
                ? t(lang, 'isolate.skeletal')
                : ((lang === 'en' ? ORGAN_META_EN : ORGAN_META)[isolatedSystem as OrganSystemId]?.nama ??
                  isolatedSystem)}
            </span>{' '}
            — {t(lang, 'isolate.hidden')}
          </span>
          <button
            type="button"
            onClick={() => setIsolatedSystem(null)}
            className="shrink-0 underline font-medium hover:text-amber-300"
          >
            {t(lang, 'isolate.exit')}
          </button>
        </div>
      )}
      {selectedHidden && selected && (
        <div className="px-4 py-1.5 bg-amber-50 border-b border-amber-200 text-xs text-amber-800">
          {lang === 'en' ? selected.nama_en : selected.nama_id} ({selected.sistem}) {t(lang, 'hidden.is')}{' '}
          <button
            type="button"
            className="underline font-medium"
            onClick={() => toggleVisibility(selected.sistem)}
          >
            {t(lang, 'hidden.show')}
          </button>
        </div>
      )}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-y-auto md:overflow-visible">
        {leftOpen && (
          <div className="w-full md:w-72 shrink-0 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col min-h-0 max-h-[70vh] md:max-h-none md:overflow-hidden">
            <OrganLayers />
            <Sidebar
              parts={results}
              selectedId={selectedId}
              hoverId={hoverId}
              visibilityMap={visibilityMap}
              onSelect={handleSelect}
              onHover={setHover}
              onToggleSystem={toggleVisibility}
              organs={organs}
              onPickOrgan={handlePickOrgan}
            />
          </div>
        )}
        <main className="flex-1 min-w-0 min-h-[50vh] md:min-h-0 p-3 md:p-4">
          <div className="h-full w-full overflow-hidden rounded-2xl border border-gray-200 bg-[radial-gradient(ellipse_at_center,#ffffff_0%,#e8edf3_100%)] shadow-inner">
            <AnatomyScene />
          </div>
        </main>
        {studySystem ? (
          <StudyPanel onQuiz={openChapterQuiz} />
        ) : (
          <InfoPanel part={selected} meshName={selectedMesh} organ={selectedOrgan} />
        )}
      </div>
      <footer className="shrink-0 border-t border-gray-200 px-4 py-1 text-[11px] text-gray-500">
        Model skeleton: MIT — JohanBellander/BodyExplorer • Organ: human-atlas (MIT) / BodyParts3D
        (CC BY 4.0) • {t(lang, 'footer.detail')}: public/ATTRIBUTION.md
      </footer>
      {quizOpen && (
        <QuizModal
          manifest={manifest}
          onClose={() => setQuizOpen(false)}
          chapterSystem={quizChapter?.system ?? null}
          chapterTitle={quizChapter?.title ?? null}
        />
      )}
      {chapterOpen && <ChapterModal onClose={() => setChapterOpen(false)} onPick={enterStudy} />}
    </div>
  )
}
