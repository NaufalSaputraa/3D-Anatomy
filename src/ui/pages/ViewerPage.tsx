import { useEffect, useMemo, useState } from 'react'
import { AnatomyScene } from '../../viewer/components/AnatomyScene'
import { useStore } from '../../viewer/state/sceneStore'
import manifestData from '../../data/manifest.json'
import type { Manifest } from '../../data/schema'
import { Sidebar } from '../components/Sidebar'
import { OrganLayers } from '../components/OrganLayers'
import { InfoPanel } from '../components/InfoPanel'
import { Toolbar } from '../components/Toolbar'
import { useSearch } from '../hooks/useSearch'
import { QuizModal } from '../quiz/QuizModal'
import { loadBest } from '../quiz/storage'
import type { QuizResult } from '../quiz/types'
import { ORGAN_META, type OrganSystemId } from '../../viewer/atlas/atlas'

export function ViewerPage() {
  const selectedId = useStore((s) => s.selectedId)
  const selectedMesh = useStore((s) => s.selectedMesh)
  const selectedOrgan = useStore((s) => s.selectedOrgan)
  const hoverId = useStore((s) => s.hoverId)
  const visibilityMap = useStore((s) => s.visibilityMap)
  const setSelected = useStore((s) => s.setSelected)
  const setSelectedOrgan = useStore((s) => s.setSelectedOrgan)
  const setHover = useStore((s) => s.setHover)
  const toggleVisibility = useStore((s) => s.toggleVisibility)
  const isolatedSystem = useStore((s) => s.isolatedSystem)
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

  const [quizOpen, setQuizOpen] = useState(false)
  const [leftOpen, setLeftOpen] = useState(true)
  const [best, setBest] = useState<QuizResult | null>(() => loadBest())

  useEffect(() => {
    if (!quizOpen) setBest(loadBest())
  }, [quizOpen])

  const manifest = manifestData as Manifest
  const { query, setQuery, results } = useSearch(manifest)
  const selected = useMemo(
    () => manifest.find((p) => p.id === selectedId) ?? null,
    [manifest, selectedId],
  )
  const selectedHidden = selected ? visibilityMap[selected.sistem] === false : false

  return (
    <div className="h-screen flex flex-col">
      <Toolbar onReset={handleReset} onQuiz={() => setQuizOpen(true)} best={best} />
      <div className="px-4 py-2 border-b border-gray-200 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setLeftOpen((v) => !v)}
          title={leftOpen ? 'Sembunyikan panel kiri' : 'Tampilkan panel kiri'}
          aria-label={leftOpen ? 'Sembunyikan panel kiri' : 'Tampilkan panel kiri'}
          className="shrink-0 rounded-lg border border-gray-300 px-2.5 py-2 text-sm leading-none hover:bg-gray-100"
        >
          {leftOpen ? '‹' : '›'}
        </button>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari: jantung, paru, skeletal..."
          className="w-full max-w-md text-sm px-3.5 py-2 rounded-lg border border-gray-300 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
        />
      </div>
      {isolatedSystem && (
        <div className="px-4 py-1.5 bg-gray-900 text-white text-xs flex items-center justify-between gap-2">
          <span className="truncate">
            Mode isolasi:{' '}
            <span className="font-semibold">
              {isolatedSystem === 'skeletal'
                ? 'Kerangka'
                : (ORGAN_META[isolatedSystem as OrganSystemId]?.nama ?? isolatedSystem)}
            </span>{' '}
            — sistem lain disembunyikan.
          </span>
          <button
            type="button"
            onClick={() => setIsolatedSystem(null)}
            className="shrink-0 underline font-medium hover:text-amber-300"
          >
            Keluar
          </button>
        </div>
      )}
      {selectedHidden && selected && (
        <div className="px-4 py-1.5 bg-amber-50 border-b border-amber-200 text-xs text-amber-800">
          {selected.nama_id} (sistem {selected.sistem}) sedang disembunyikan.{' '}
          <button
            type="button"
            className="underline font-medium"
            onClick={() => toggleVisibility(selected.sistem)}
          >
            Tampilkan lagi
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
            />
          </div>
        )}
        <main className="flex-1 min-w-0 min-h-[50vh] md:min-h-0">
          <AnatomyScene />
        </main>
        <InfoPanel part={selected} meshName={selectedMesh} organ={selectedOrgan} />
      </div>
      <footer className="shrink-0 border-t border-gray-200 px-4 py-1 text-[11px] text-gray-500">
        Model skeleton: MIT — JohanBellander/BodyExplorer • Organ: human-atlas (MIT) / BodyParts3D
        (CC BY 4.0) • Detail: public/ATTRIBUTION.md
      </footer>
      {quizOpen && <QuizModal manifest={manifest} onClose={() => setQuizOpen(false)} />}
    </div>
  )
}
