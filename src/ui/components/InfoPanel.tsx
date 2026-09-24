import type { BodyPart } from '../../data/schema'
import { describeBone } from '../../data/transform'
import {
  MANIFEST_ORGAN_LAYER,
  ORGAN_META,
  organExplanation,
  type OrganSystemId,
} from '../../viewer/atlas/atlas'
import { useStore, type SelectedOrgan } from '../../viewer/state/sceneStore'

const PANEL_CLASS =
  'w-full md:w-72 shrink-0 border-t md:border-t-0 md:border-l border-gray-200 bg-white p-4 overflow-y-auto'

interface Props {
  part: BodyPart | null
  meshName: string | null
  organ: SelectedOrgan | null
}

export function InfoPanel({ part, meshName, organ }: Props) {
  const organEnabled = useStore((s) => s.organEnabled)
  const setOrganEnabled = useStore((s) => s.setOrganEnabled)
  const setIsolatedSystem = useStore((s) => s.setIsolatedSystem)

  const focusSystem = (system: string) => {
    if (system !== 'skeletal') setOrganEnabled(system, true)
    setIsolatedSystem(system)
  }

  if (organ) {
    const sys = organ.system as OrganSystemId
    const meta = ORGAN_META[sys]
    return (
      <aside className={`${PANEL_CLASS} max-h-64 md:max-h-none`}>
        <span
          className="inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider"
          style={{
            backgroundColor: `${meta?.color ?? '#aebbb8'}22`,
            borderColor: `${meta?.color ?? '#aebbb8'}66`,
            color: '#374151',
          }}
        >
          {meta?.nama ?? organ.system}
        </span>
        <h2 className="mt-2 text-lg font-bold tracking-tight">{organ.name}</h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-700">
          {organExplanation(organ.name, sys)}
        </p>
        <p className="mt-3 text-xs font-mono bg-gray-900 text-amber-300 rounded-lg px-2.5 py-1.5 break-all">
          Part ID: {organ.id}
        </p>
        <button
          type="button"
          onClick={() => focusSystem(organ.system)}
          className="mt-3 w-full rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          Fokus sistem ini
        </button>
      </aside>
    )
  }

  if (meshName) {
    const bone = describeBone(meshName)
    return (
      <aside className={`${PANEL_CLASS} max-h-64 md:max-h-none`}>
        <span className="inline-block rounded-full bg-amber-100 border border-amber-200 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-amber-800">
          {bone.region}
        </span>
        <h2 className="mt-2 text-lg font-bold tracking-tight">{bone.title}</h2>
        <p className="text-sm text-gray-500 italic">{bone.latin}</p>
        <p className="mt-3 text-sm leading-relaxed text-gray-700">{bone.detail}</p>
        {part && (
          <p className="mt-3 text-xs text-gray-500">
            Masuk sistem:{' '}
            <span className="font-medium text-gray-700">
              {part.nama_id} • {part.sistem}
            </span>
          </p>
        )}
        <p className="mt-3 text-xs font-mono bg-gray-900 text-amber-300 rounded-lg px-2.5 py-1.5 break-all">
          Mesh 3D: {meshName}
        </p>
        <button
          type="button"
          onClick={() => focusSystem('skeletal')}
          className="mt-3 w-full rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          Fokus kerangka
        </button>
      </aside>
    )
  }

  if (!part) {
    return (
      <aside className={`${PANEL_CLASS} max-h-40 md:max-h-none text-sm text-gray-500`}>
        Klik struktur di kiri atau objek 3D untuk melihat detail.
      </aside>
    )
  }

  const layer = MANIFEST_ORGAN_LAYER[part.id]
  const layerMeta = layer ? ORGAN_META[layer] : undefined
  const layerOn = layer ? !!organEnabled[layer] : false

  return (
    <aside className={`${PANEL_CLASS} max-h-48 md:max-h-none`}>
      <span className="inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
        {part.sistem}
      </span>
      <h2 className="mt-2 text-lg font-bold tracking-tight">{part.nama_id}</h2>
      <p className="text-sm text-gray-500 italic">{part.nama_en}</p>
      <p className="mt-3 text-sm leading-relaxed text-gray-700">{part.deskripsi_id}</p>
      {layer && layerMeta && !layerOn && (
        <div className="mt-3 rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-2 text-xs text-emerald-800">
          Model 3D {layerMeta.nama.toLowerCase()} tersedia sebagai lapisan organ.{' '}
          <button
            type="button"
            className="underline font-medium"
            onClick={() => setOrganEnabled(layer, true)}
          >
            Aktifkan
          </button>
        </div>
      )}
      {part.sistem !== 'Skeletal' && !layer && (
        <p className="mt-3 rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-2 text-xs text-amber-800">
          Model 3D organ ini belum tersedia — kerangka ditampilkan sebagai referensi posisi.
        </p>
      )}
      {(layer ?? (part.sistem === 'Skeletal' ? 'skeletal' : null)) && (
        <button
          type="button"
          onClick={() => focusSystem(layer ?? 'skeletal')}
          className="mt-3 w-full rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          Fokus {layer && layerMeta ? layerMeta.nama.toLowerCase() : 'kerangka'}
        </button>
      )}
    </aside>
  )
}
