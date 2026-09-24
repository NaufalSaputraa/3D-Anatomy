import { create } from 'zustand'

export type VisibilityMap = Record<string, boolean>
export type OrganStatus = 'idle' | 'loading' | 'ready' | 'error'
export type Lang = 'id' | 'en'

const LANG_KEY = 'anatomy-lang'

function initialLang(): Lang {
  try {
    return localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'id'
  } catch {
    return 'id'
  }
}

export interface SelectedOrgan {
  id: string
  name: string
  system: string
}

export interface PendingOrganPick {
  system: string
  partId: string
}

export interface FocusRequest {
  point: [number, number, number]
  size: number
  token: number
}

interface SceneState {
  selectedId: string | null
  hoverId: string | null
  selectedMesh: string | null
  selectedOrgan: SelectedOrgan | null
  pendingOrganPick: PendingOrganPick | null
  focusRequest: FocusRequest | null
  lang: Lang
  isolatedSystem: string | null
  studySystem: string | null
  organEnabled: Record<string, boolean>
  organStatus: Record<string, OrganStatus>
  organProgress: Record<string, number>
  visibilityMap: VisibilityMap
  viewKey: number

  // Actions
  setSelected: (id: string | null) => void
  setHover: (id: string | null) => void
  setSelectedMesh: (name: string | null) => void
  setSelectedOrgan: (organ: SelectedOrgan | null) => void
  setPendingOrganPick: (pick: PendingOrganPick | null) => void
  setFocusRequest: (req: FocusRequest | null) => void
  setLang: (lang: Lang) => void
  setIsolatedSystem: (system: string | null) => void
  setStudySystem: (system: string | null) => void
  setOrganEnabled: (system: string, enabled: boolean) => void
  setOrganStatus: (system: string, status: OrganStatus, progress?: number) => void
  toggleVisibility: (id: string) => void
  resetVisibility: () => void
  reset: () => void
  resetView: () => void
}

export const useStore = create<SceneState>((set) => ({
  selectedId: null,
  hoverId: null,
  selectedMesh: null,
  selectedOrgan: null,
  pendingOrganPick: null,
  focusRequest: null,
  lang: initialLang(),
  isolatedSystem: null,
  studySystem: null,
  organEnabled: {},
  organStatus: {},
  organProgress: {},
  visibilityMap: {},
  viewKey: 0,

  setSelected: (id) => set({ selectedId: id }),
  setHover: (id) => set({ hoverId: id }),
  setSelectedMesh: (name) => set({ selectedMesh: name }),
  setSelectedOrgan: (organ) => set({ selectedOrgan: organ }),
  setPendingOrganPick: (pick) => set({ pendingOrganPick: pick }),
  setFocusRequest: (req) => set({ focusRequest: req }),
  setLang: (lang) => {
    try {
      localStorage.setItem(LANG_KEY, lang)
    } catch {
      // abaikan: preferensi tidak tersimpan, default Indonesia
    }
    set({ lang })
  },
  setIsolatedSystem: (system) => set({ isolatedSystem: system }),
  setStudySystem: (system) => set({ studySystem: system }),
  setOrganEnabled: (system, enabled) =>
    set((state) => ({ organEnabled: { ...state.organEnabled, [system]: enabled } })),
  setOrganStatus: (system, status, progress) =>
    set((state) => ({
      organStatus: { ...state.organStatus, [system]: status },
      organProgress:
        progress === undefined
          ? state.organProgress
          : { ...state.organProgress, [system]: progress },
    })),
  toggleVisibility: (id) =>
    set((state) => ({
      visibilityMap: {
        ...state.visibilityMap,
        [id]: !state.visibilityMap[id],
      },
    })),
  resetVisibility: () =>
    set({ visibilityMap: {} }),
  reset: () =>
    set({
      selectedId: null,
      hoverId: null,
      selectedMesh: null,
      selectedOrgan: null,
      pendingOrganPick: null,
      focusRequest: null,
      isolatedSystem: null,
      studySystem: null,
      visibilityMap: {},
    }),
  resetView: () =>
    set((state) => ({
      viewKey: state.viewKey + 1,
    })),
}))