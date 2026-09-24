import { create } from 'zustand'

export type VisibilityMap = Record<string, boolean>
export type OrganStatus = 'idle' | 'loading' | 'ready' | 'error'

export interface SelectedOrgan {
  id: string
  name: string
  system: string
}

interface SceneState {
  selectedId: string | null
  hoverId: string | null
  selectedMesh: string | null
  selectedOrgan: SelectedOrgan | null
  isolatedSystem: string | null
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
  setIsolatedSystem: (system: string | null) => void
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
  isolatedSystem: null,
  organEnabled: {},
  organStatus: {},
  organProgress: {},
  visibilityMap: {},
  viewKey: 0,

  setSelected: (id) => set({ selectedId: id }),
  setHover: (id) => set({ hoverId: id }),
  setSelectedMesh: (name) => set({ selectedMesh: name }),
  setSelectedOrgan: (organ) => set({ selectedOrgan: organ }),
  setIsolatedSystem: (system) => set({ isolatedSystem: system }),
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
      isolatedSystem: null,
      visibilityMap: {},
    }),
  resetView: () =>
    set((state) => ({
      viewKey: state.viewKey + 1,
    })),
}))