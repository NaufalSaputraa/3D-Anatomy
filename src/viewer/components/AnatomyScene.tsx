import { Component, Suspense, type ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei'
import { ModelGroup } from './ModelGroup'
import { OrganSystem } from './OrganSystem'
import { ORGAN_SYSTEMS } from '../atlas/atlas'
import { useStore } from '../state/sceneStore'

class ModelErrorBoundary extends Component<{ children: ReactNode }, { error: string | null }> {
  state = { error: null as string | null }

  static getDerivedStateFromError(err: unknown) {
    return { error: err instanceof Error ? err.message : 'Gagal memuat model 3D' }
  }

  render() {
    if (this.state.error) {
      return (
        <Html center>
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-xs text-red-700 whitespace-nowrap">
            Model gagal dimuat: {this.state.error}
          </div>
        </Html>
      )
    }
    return this.props.children
  }
}

function OrganLayers3D() {
  const organEnabled = useStore((s) => s.organEnabled)
  return (
    <>
      {ORGAN_SYSTEMS.filter((sys) => organEnabled[sys]).map((sys) => (
        <OrganSystem key={sys} system={sys} />
      ))}
    </>
  )
}

export const AnatomyScene = () => {
  const viewKey = useStore((s) => s.viewKey)
  return (
    <Canvas
      camera={{ position: [0, 0.7, 5.1], fov: 45 }}
      gl={{ antialias: true }}
      onPointerMissed={() => {
        const st = useStore.getState()
        st.setSelected(null)
        st.setSelectedMesh(null)
        st.setSelectedOrgan(null)
      }}
      onCreated={({ gl }) => {
        gl.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        gl.setClearColor(0xf8fafc, 1)
      }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} />
      <OrbitControls
        key={viewKey}
        enableDamping
        makeDefault
        target={[0, 0.35, 0]}
        enablePan
        screenSpacePanning
        zoomToCursor
        minDistance={0.05}
        maxDistance={10}
      />
      <Suspense fallback={null}>
        <ModelErrorBoundary>
          <ModelGroup />
          <OrganLayers3D />
        </ModelErrorBoundary>
      </Suspense>
    </Canvas>
  )
}
