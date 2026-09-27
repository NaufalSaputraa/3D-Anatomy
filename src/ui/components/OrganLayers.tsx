import { useState } from 'react'
import { useStore } from '../../viewer/state/sceneStore'
import { ORGAN_META, ORGAN_META_EN, ORGAN_SYSTEMS } from '../../viewer/atlas/atlas'
import { useLang, t } from '../i18n/strings'

// Daftar lapisan organ 3D (BodyParts3D). Mengaktifkan lapisan men-download
// chunk geometrinya secara lazy; menonaktifkan melepasnya dari memori.
export function OrganLayers() {
  const lang = useLang()
  const [open, setOpen] = useState(true)
  const organEnabled = useStore((s) => s.organEnabled)
  const organStatus = useStore((s) => s.organStatus)
  const organProgress = useStore((s) => s.organProgress)
  const setOrganEnabled = useStore((s) => s.setOrganEnabled)

  return (
    <div className="shrink-0 border-b border-gray-200 bg-white p-3 max-h-64 overflow-y-auto">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between mb-1 px-1 text-left"
      >
        <span className="text-sm font-semibold">
          {t(lang, 'organs.title')}{' '}
          <span className="font-normal text-gray-400">
            • {ORGAN_SYSTEMS.filter((s) => organEnabled[s]).length}/{ORGAN_SYSTEMS.length}
          </span>
        </span>
        <span className="text-gray-400 text-xs" aria-hidden>
          {open ? '▾' : '▸'}
        </span>
      </button>
      {open && (
        <>
          <p className="text-[11px] text-gray-500 mb-2 px-1">{t(lang, 'organs.sub')}</p>
          <div className="flex flex-col gap-1">
            {ORGAN_SYSTEMS.map((sys) => {
          const meta = lang === 'en' ? ORGAN_META_EN[sys] : ORGAN_META[sys]
          const enabled = !!organEnabled[sys]
          const status = organStatus[sys] ?? 'idle'
          const progress = organProgress[sys] ?? 0
          const statusText =
            status === 'loading'
              ? `${t(lang, 'organs.loading')}… ${progress}%`
              : status === 'ready'
                ? t(lang, 'organs.ready')
                : status === 'error'
                  ? t(lang, 'organs.failed')
                  : t(lang, 'organs.notLoaded')
          return (
            <div
              key={sys}
              className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 text-sm transition-colors ${
                enabled ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span
                className="inline-block h-3 w-3 shrink-0 rounded-full border border-black/10"
                style={{ backgroundColor: ORGAN_META[sys].color }}
                aria-hidden
              />
              <div className="flex-1 min-w-0 text-left">
                <div className="font-medium leading-tight">{meta.nama}</div>
                <div className="text-[11px] text-gray-500 leading-tight">{statusText}</div>
              </div>
              <button
                type="button"
                title={enabled ? `${t(lang, 'organs.hide')} ${meta.nama}` : `${t(lang, 'organs.show')} ${meta.nama}`}
                onClick={() => setOrganEnabled(sys, !enabled)}
                className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                  enabled ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-300 hover:bg-gray-100'
                }`}
              >
                {enabled ? '👁' : '○'}
              </button>
            </div>
          )
        })}
          </div>
        </>
      )}
    </div>
  )
}
