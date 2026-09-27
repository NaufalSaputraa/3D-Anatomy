import { useMemo, useState } from 'react'
import type { Manifest } from '../../data/schema'
import type { OrganMatch } from '../hooks/useSearch'
import type { VisibilityMap } from '../../viewer/state/sceneStore'
import { useLang, t } from '../i18n/strings'

const SYSTEM_EN: Record<string, string> = {
  Skeletal: 'Skeletal',
  Sirkulasi: 'Circulatory',
  Pernapasan: 'Respiratory',
  Pencernaan: 'Digestive',
  Ekskresi: 'Excretory',
  Saraf: 'Nervous',
  Integumen: 'Integumentary',
  Muskuloskeletal: 'Musculoskeletal',
}

interface Props {
  parts: Manifest
  selectedId: string | null
  hoverId: string | null
  visibilityMap: VisibilityMap
  onSelect: (id: string | null) => void
  onHover: (id: string | null) => void
  onToggleSystem: (system: string) => void
  organs?: OrganMatch[]
  onPickOrgan?: (organ: OrganMatch) => void
}

export function Sidebar({ parts, selectedId, hoverId, visibilityMap, onSelect, onHover, onToggleSystem, organs, onPickOrgan }: Props) {
  const lang = useLang()
  const [open, setOpen] = useState(true)
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
    <aside
      className={`w-full overflow-y-auto bg-white p-3 ${
        open ? 'flex-1 min-h-0' : 'shrink-0'
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between mb-2 text-left"
      >
        <span className="text-sm font-semibold">
          {t(lang, 'sidebar.title')} ({parts.length})
        </span>
        <span className="text-gray-400 text-xs" aria-hidden>
          {open ? '▾' : '▸'}
        </span>
      </button>
      {open && (
        <>
          {organs && organs.length > 0 && onPickOrgan && (
        <div className="mb-3">
          <div className="px-1 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              {t(lang, 'sidebar.organs')} • {organs.length}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            {organs.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => onPickOrgan(o)}
                className="text-left text-sm px-2.5 py-2 rounded-lg border border-gray-200 hover:border-gray-900 hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium leading-tight">{o.name}</div>
                <div className="text-[11px] text-gray-500 leading-tight">{o.system}</div>
              </button>
            ))}
          </div>
        </div>
      )}
      {groups.map(([system, list]) => {
        const hidden = visibilityMap[system] === false
        const systemLabel = lang === 'en' ? (SYSTEM_EN[system] ?? system) : system
        return (
          <div key={system} className="mb-3">
            <div className="flex items-center justify-between mb-1 px-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                {systemLabel} <span className="font-normal">• {list.length}</span>
              </span>
              <button
                type="button"
                title={hidden ? `${t(lang, 'organs.show')} ${systemLabel}` : `${t(lang, 'organs.hide')} ${systemLabel}`}
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
                const primary = lang === 'en' ? p.nama_en : p.nama_id
                const secondary = lang === 'en' ? p.nama_id : p.nama_en
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
                    <div className="font-medium">{primary}</div>
                    <div className="text-xs opacity-70">{secondary}</div>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
        </>
      )}
    </aside>
  )
}
