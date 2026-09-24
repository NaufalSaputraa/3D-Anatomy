import { useStore } from '../../viewer/state/sceneStore'
import { ORGAN_META, ORGAN_SYSTEMS } from '../../viewer/atlas/atlas'

// Daftar lapisan organ 3D (BodyParts3D). Mengaktifkan lapisan men-download
// chunk geometrinya secara lazy; menonaktifkan melepasnya dari memori.
export function OrganLayers() {
  const organEnabled = useStore((s) => s.organEnabled)
  const organStatus = useStore((s) => s.organStatus)
  const organProgress = useStore((s) => s.organProgress)
  const setOrganEnabled = useStore((s) => s.setOrganEnabled)

  return (
    <div className="shrink-0 border-b border-gray-200 p-3 max-h-64 overflow-y-auto">
      <h2 className="text-sm font-semibold mb-1 px-1">Lapisan Organ</h2>
      <p className="text-[11px] text-gray-500 mb-2 px-1">Model 3D organ dalam (lazy-load).</p>
      <div className="flex flex-col gap-1">
        {ORGAN_SYSTEMS.map((sys) => {
          const meta = ORGAN_META[sys]
          const enabled = !!organEnabled[sys]
          const status = organStatus[sys] ?? 'idle'
          const progress = organProgress[sys] ?? 0
          return (
            <div
              key={sys}
              className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 text-sm transition-colors ${
                enabled ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span
                className="inline-block h-3 w-3 shrink-0 rounded-full border border-black/10"
                style={{ backgroundColor: meta.color }}
                aria-hidden
              />
              <div className="flex-1 min-w-0 text-left">
                <div className="font-medium leading-tight">{meta.nama}</div>
                <div className="text-[11px] text-gray-500 leading-tight">
                  {status === 'loading'
                    ? `Memuat… ${progress}%`
                    : status === 'ready'
                      ? 'Siap'
                      : status === 'error'
                        ? 'Gagal dimuat — coba lagi'
                        : 'Belum dimuat'}
                </div>
              </div>
              <button
                type="button"
                title={enabled ? `Sembunyikan ${meta.nama}` : `Tampilkan ${meta.nama}`}
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
    </div>
  )
}
