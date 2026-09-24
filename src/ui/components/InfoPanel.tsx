import type { BodyPart } from '../../data/schema'
import { describeBone } from '../../data/transform'
import {
  MANIFEST_ORGAN_LAYER,
  ORGAN_META,
  ORGAN_META_EN,
  organExplanation,
  organExplanationEn,
  type OrganSystemId,
} from '../../viewer/atlas/atlas'
import { useStore, type SelectedOrgan } from '../../viewer/state/sceneStore'
import { useLang, t } from '../i18n/strings'

const PANEL_CLASS =
  'w-full md:w-72 shrink-0 border-t md:border-t-0 md:border-l border-gray-200 bg-white p-4 overflow-y-auto'

interface Props {
  part: BodyPart | null
  meshName: string | null
  organ: SelectedOrgan | null
}

export function InfoPanel({ part, meshName, organ }: Props) {
  const lang = useLang()
  const organEnabled = useStore((s) => s.organEnabled)
  const setOrganEnabled = useStore((s) => s.setOrganEnabled)
  const setIsolatedSystem = useStore((s) => s.setIsolatedSystem)

  const focusSystem = (system: string) => {
    if (system !== 'skeletal') setOrganEnabled(system, true)
    setIsolatedSystem(system)
  }

  if (organ) {
    const sys = organ.system as OrganSystemId
    const meta = lang === 'en' ? ORGAN_META_EN[sys] : ORGAN_META[sys]
    const explain = lang === 'en' ? organExplanationEn(organ.name, sys) : organExplanation(organ.name, sys)
    return (
      <aside className={`${PANEL_CLASS} max-h-64 md:max-h-none`}>
        <span
          className="inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider"
          style={{
            backgroundColor: `${ORGAN_META[sys]?.color ?? '#aebbb8'}22`,
            borderColor: `${ORGAN_META[sys]?.color ?? '#aebbb8'}66`,
            color: '#374151',
          }}
        >
          {meta?.nama ?? organ.system}
        </span>
        <h2 className="mt-2 text-lg font-bold tracking-tight">{organ.name}</h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-700">{explain}</p>
        <p className="mt-3 text-xs font-mono bg-gray-900 text-amber-300 rounded-lg px-2.5 py-1.5 break-all">
          Part ID: {organ.id}
        </p>
        <button
          type="button"
          onClick={() => focusSystem(organ.system)}
          className="mt-3 w-full rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          {t(lang, 'isolate.focusSystem')}
        </button>
      </aside>
    )
  }

  if (meshName) {
    const bone = describeBone(meshName, lang)
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
            {t(lang, 'info.system')}:{' '}
            <span className="font-medium text-gray-700">
              {lang === 'en' ? part.nama_en : part.nama_id} • {part.sistem}
            </span>
          </p>
        )}
        <p className="mt-3 text-xs font-mono bg-gray-900 text-amber-300 rounded-lg px-2.5 py-1.5 break-all">
          {t(lang, 'info.mesh')}: {meshName}
        </p>
        <button
          type="button"
          onClick={() => focusSystem('skeletal')}
          className="mt-3 w-full rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          {t(lang, 'isolate.focusSkeletal')}
        </button>
      </aside>
    )
  }

  if (!part) {
    return (
      <aside className={`${PANEL_CLASS} max-h-40 md:max-h-none text-sm text-gray-500`}>
        {t(lang, 'info.empty')}
      </aside>
    )
  }

  const layer = MANIFEST_ORGAN_LAYER[part.id]
  const layerMeta = layer ? (lang === 'en' ? ORGAN_META_EN[layer] : ORGAN_META[layer]) : undefined
  const layerOn = layer ? !!organEnabled[layer] : false
  const primary = lang === 'en' ? part.nama_en : part.nama_id
  const secondary = lang === 'en' ? part.nama_id : part.nama_en

  return (
    <aside className={`${PANEL_CLASS} max-h-48 md:max-h-none`}>
      <span className="inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
        {part.sistem}
      </span>
      <h2 className="mt-2 text-lg font-bold tracking-tight">{primary}</h2>
      <p className="text-sm text-gray-500 italic">{secondary}</p>
      <p className="mt-3 text-sm leading-relaxed text-gray-700">
        {lang === 'en' ? part.deskripsi_en : part.deskripsi_id}
      </p>
      {layer && layerMeta && !layerOn && (
        <div className="mt-3 rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-2 text-xs text-emerald-800">
          {lang === 'en' ? (
            <>
              {layerMeta.nama} {t(lang, 'info.available')}{' '}
            </>
          ) : (
            <>Model 3D {layerMeta.nama.toLowerCase()} {t(lang, 'info.available')}{' '}</>
          )}
          <button
            type="button"
            className="underline font-medium"
            onClick={() => setOrganEnabled(layer, true)}
          >
            {t(lang, 'info.activate')}
          </button>
        </div>
      )}
      {part.sistem !== 'Skeletal' && !layer && (
        <p className="mt-3 rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-2 text-xs text-amber-800">
          {t(lang, 'info.noOrgan')}
        </p>
      )}
      {(layer ?? (part.sistem === 'Skeletal' ? 'skeletal' : null)) && (
        <button
          type="button"
          onClick={() => focusSystem(layer ?? 'skeletal')}
          className="mt-3 w-full rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          {layer && layerMeta
            ? lang === 'en'
              ? `Focus ${layerMeta.nama}`
              : `Fokus ${layerMeta.nama.toLowerCase()}`
            : t(lang, 'isolate.focusSkeletal')}
        </button>
      )}
    </aside>
  )
}
