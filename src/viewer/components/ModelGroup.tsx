import { useEffect, useMemo, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../state/sceneStore'
import manifestData from '../../data/manifest.json'
import type { Manifest } from '../../data/schema'
import { meshNameToPartId } from '../../data/transform'

// Model: JohanBellander/BodyExplorer skeleton.glb (MIT). See public/ATTRIBUTION.md
// Mewakili sistem "Skeletal" dari manifest.
// Catatan data: model dalam milimeter (±1700 unit di sumbu Z) dan 201 mesh
// berbagi 1 material — dinormalisasi di sini: center + tegakkan (Z-up -> Y-up)
// + skala ke ±2 unit, dan material di-clone per mesh agar highlight per-tulang bisa.
// Klik tulang memetakan nama mesh ke entri manifest terdekat (meshNameToPartId).
const TARGET_HEIGHT = 2
const manifest = manifestData as Manifest

function systemOf(partId: string | null): string | null {
  if (!partId) return null
  return manifest.find((p) => p.id === partId)?.sistem ?? null
}

export function ModelGroup() {
  const { scene } = useGLTF('/models/skeleton.glb')
  const selectedId = useStore((s) => s.selectedId)
  const hoverId = useStore((s) => s.hoverId)
  const selectedMesh = useStore((s) => s.selectedMesh)
  const visibilityMap = useStore((s) => s.visibilityMap)
  const isolatedSystem = useStore((s) => s.isolatedSystem)
  const organEnabled = useStore((s) => s.organEnabled)
  const setSelected = useStore((s) => s.setSelected)
  const setHover = useStore((s) => s.setHover)
  const setSelectedMesh = useStore((s) => s.setSelectedMesh)
  const setSelectedOrgan = useStore((s) => s.setSelectedOrgan)

  const [hoveredMesh, setHoveredMesh] = useState<string | null>(null)

  const selected = selectedId !== null
  const selectedSkeletal = systemOf(selectedId) === 'Skeletal'
  const hoveredSkeletal = systemOf(hoverId) === 'Skeletal'
  const visible =
    visibilityMap['Skeletal'] !== false && (!isolatedSystem || isolatedSystem === 'skeletal')
  const anyOrganOn = Object.values(organEnabled).some(Boolean)

  const model = useMemo(() => {
    const copy = scene.clone(true)
    let i = 0
    copy.traverse((obj) => {
      const mesh = obj as THREE.Mesh
      if (!mesh.isMesh) return
      if (!obj.name) obj.name = `mesh_${i}`
      i += 1
      const mat = (mesh as unknown as { material?: THREE.Material }).material
      if (mat) mesh.material = mat.clone()
    })
    const box = new THREE.Box3().setFromObject(copy)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    copy.position.sub(center)
    const root = new THREE.Group()
    root.add(copy)
    root.rotation.x = -Math.PI / 2
    root.scale.setScalar(TARGET_HEIGHT / Math.max(size.x, size.y, size.z))
    return root
  }, [scene])

  useEffect(() => {
    model.traverse((obj) => {
      const mesh = obj as THREE.Mesh
      const mat = (mesh as unknown as { material?: THREE.MeshStandardMaterial }).material
      if (!mesh.isMesh || !mat || !('emissive' in mat)) return
      const isFocus = mesh.name === selectedMesh || mesh.name === hoveredMesh
      if (mesh.name === selectedMesh) {
        mat.emissive = new THREE.Color('#f59e0b')
        mat.emissiveIntensity = 0.55
      } else if (mesh.name === hoveredMesh) {
        mat.emissive = new THREE.Color('#fbbf24')
        mat.emissiveIntensity = 0.3
      } else if (selected && selectedMesh === null && selectedSkeletal) {
        mat.emissive = new THREE.Color('#f59e0b')
        mat.emissiveIntensity = 0.2
      } else if (hoveredSkeletal) {
        mat.emissive = new THREE.Color('#fbbf24')
        mat.emissiveIntensity = 0.1
      } else {
        mat.emissive = new THREE.Color('#000000')
        mat.emissiveIntensity = 0
      }
      // Redupkan tulang saat lapisan organ aktif agar organ terlihat.
      const dim = anyOrganOn && !isFocus
      const meta = mesh.userData as { dimmed?: boolean }
      if ((meta.dimmed ?? false) !== dim) {
        mat.transparent = dim
        mat.needsUpdate = true
        meta.dimmed = dim
      }
      mat.opacity = dim ? 0.3 : 1
    })
  }, [model, selected, selectedSkeletal, selectedMesh, hoveredMesh, hoveredSkeletal, anyOrganOn])

  const meshNameOf = (e: ThreeEvent<MouseEvent> | ThreeEvent<PointerEvent>) =>
    (e.object as THREE.Mesh).name || null

  const pick = (e: ThreeEvent<MouseEvent> | ThreeEvent<PointerEvent>) => meshNameToPartId(meshNameOf(e) ?? '')

  return (
    <primitive
      object={model}
      visible={visible}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation()
        if (selectedMesh) {
          setSelectedMesh(null)
          setSelected(null)
          setSelectedOrgan(null)
        } else {
          setSelectedMesh(meshNameOf(e))
          setSelected(pick(e))
          setSelectedOrgan(null)
        }
      }}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation()
        setHoveredMesh(meshNameOf(e))
        setHover(pick(e))
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHoveredMesh(null)
        setHover(null)
        document.body.style.cursor = 'auto'
      }}
    />
  )
}

useGLTF.preload('/models/skeleton.glb')
