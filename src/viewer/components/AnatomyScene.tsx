import { Component, Suspense, useEffect, type ReactNode } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { ModelGroup } from './ModelGroup'
import { OrganSystem } from './OrganSystem'
import { ORGAN_SYSTEMS, computeAtlasFrame, fetchAtlas } from '../atlas/atlas'
import { useStore } from '../state/sceneStore'

interface ControlsLike {
  target: THREE.Vector3
  update: () => void
}

// Menerapkan permintaan fokus (dari hasil pencarian organ): gerakkan target
// OrbitControls + kamera ke titik part dalam koordinat ternormalisasi.
function FocusController() {
  const controls = useThree((s) => s.controls) as unknown as ControlsLike | null
  const camera = useThree((s) => s.camera)
  const focusRequest = useStore((s) => s.focusRequest)
  const setFocusRequest = useStore((s) => s.setFocusRequest)

  useEffect(() => {
    if (!focusRequest || !controls) return
    let cancelled = false
    ;(async () => {
      try {
        const atlas = await fetchAtlas()
        if (cancelled) return
        const frame = computeAtlasFrame(atlas.parts)
        const p = new THREE.Vector3(...focusRequest.point)
          .multiplyScalar(frame.scale)
          .add(new THREE.Vector3(...frame.offset))
        const dist = THREE.MathUtils.clamp(focusRequest.size * frame.scale * 6, 0.4, 6)
        const dir = camera.position.clone().sub(controls.target).normalize()
        controls.target.copy(p)
        camera.position.copy(p).addScaledVector(dir, dist)
        controls.update()
      } finally {
        if (!cancelled) setFocusRequest(null)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [focusRequest, controls, camera, setFocusRequest])
  return null
}

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
      <FocusController />
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
