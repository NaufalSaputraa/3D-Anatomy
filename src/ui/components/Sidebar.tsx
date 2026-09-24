import { useMemo } from 'react'
import type { Manifest } from '../../data/schema'
import type { VisibilityMap } from '../../viewer/state/sceneStore'

interface Props {
  parts: Manifest
  selectedId: string | null
  hoverId: string | null
  visibilityMap: VisibilityMap
  onSelect: (id: string | null) => void
  onHover: (id: string | null) => void
  onToggleSystem: (system: string) => void
}

export function Sidebar({ parts, selectedId, hoverId, visibilityMap, onSelect, onHover, onToggleSystem }: Props) {
  const groups = useMemo(() => {
    const map = new Map<string, Manifest>()
    for (const p of parts) {
      const list = map.get(p.sistem) ?? []
      list.push(p)
      map.set(p.sistem, list)
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b))
  }, [parts])

  return (
    <aside className="flex-1 min-h-0 w-full overflow-y-auto p-3">
      <h2 className="text-sm font-semibold mb-2">Struktur ({parts.length})</h2>
      {groups.map(([system, list]) => {
        const hidden = visibilityMap[system] === false
        return (
          <div key={system} className="mb-3">
            <div className="flex items-center justify-between mb-1 px-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                {system} <span className="font-normal">• {list.length}</span>
              </span>
              <button
                type="button"
                title={hidden ? 'Tampilkan sistem' : 'Sembunyikan sistem'}
                onClick={() => onToggleSystem(system)}
                className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
                  hidden ? 'border-amber-300 bg-amber-50' : 'border-gray-300 hover:bg-gray-100'
                }`}
              >
                {hidden ? '👁‍🗨' : '👁'}
              </button>
            </div>
            <div className="flex flex-col gap-1">
              {list.map((p) => {
                const isSel = p.id === selectedId
                const isHover = p.id === hoverId
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onSelect(p.id === selectedId ? null : p.id)}
                    onMouseEnter={() => onHover(p.id)}
                    onMouseLeave={() => onHover(null)}
                    className={`text-left text-sm px-2.5 py-2 rounded-lg border transition-colors ${
                      isSel
                        ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                        : isHover
                          ? 'bg-amber-100 border-amber-300'
                          : 'border-transparent hover:bg-gray-100'
                    } ${hidden ? 'opacity-40' : ''}`}
                  >
                    <div className="font-medium">{p.nama_id}</div>
                    <div className="text-xs opacity-70">{p.nama_en}</div>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </aside>
  )
}
