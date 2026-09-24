import { useEffect, useMemo, useState } from 'react'
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import type { ThreeEvent } from '@react-three/fiber'
import { useStore } from '../state/sceneStore'
import {
  ORGAN_META,
  buildPartGeometry,
  computeAtlasFrame,
  fetchAtlas,
  fetchChunk,
  type AtlasFrame,
  type AtlasPart,
  type OrganSystemId,
} from '../atlas/atlas'

interface MergedSystem {
  geometry: THREE.BufferGeometry
  parts: AtlasPart[]
  buffers: Map<number, ArrayBuffer>
}

// Satu lapisan sistem organ dirender sebagai SATU mesh gabungan (1 draw call)
// agar 600+ part (otot, arteri) tidak menjatuhkan frame rate. Picking memakai
// rentang face hasil merge (deterministik, tanpa raycast tambahan), highlight
// memakai satu mesh overlay untuk part terpilih. Tanpa hover-raycast.
export function OrganSystem({ system }: { system: OrganSystemId }) {
  const setOrganStatus = useStore((s) => s.setOrganStatus)
  const selectedOrgan = useStore((s) => s.selectedOrgan)
  const isolatedSystem = useStore((s) => s.isolatedSystem)
  const pendingOrganPick = useStore((s) => s.pendingOrganPick)
  const setPendingOrganPick = useStore((s) => s.setPendingOrganPick)
  const setFocusRequest = useStore((s) => s.setFocusRequest)
  const setSelectedOrgan = useStore((s) => s.setSelectedOrgan)
  const setSelected = useStore((s) => s.setSelected)
  const setSelectedMesh = useStore((s) => s.setSelectedMesh)

  const [frame, setFrame] = useState<AtlasFrame | null>(null)
  const [merged, setMerged] = useState<MergedSystem | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setOrganStatus(system, 'loading', 0)
    setError(null)
    ;(async () => {
      try {
        const atlas = await fetchAtlas()
        if (!cancelled) setFrame(computeAtlasFrame(atlas.parts))
        const parts = atlas.parts.filter((p) => p.system === system)
        const needed = [...new Set(parts.map((p) => p.chunk))].sort((a, b) => a - b)
        const buffers = new Map<number, ArrayBuffer>()
        for (let i = 0; i < needed.length; i++) {
          const ci = needed[i]
          buffers.set(ci, await fetchChunk(ci, atlas.chunks))
          if (!cancelled) setOrganStatus(system, 'loading', Math.round(((i + 1) / needed.length) * 100))
        }
        if (cancelled) return
        const geos = parts.map((part) => buildPartGeometry(buffers.get(part.chunk)!, part))
        const geometry = mergeGeometries(geos, false)
        geos.forEach((g) => g.dispose())
        if (!geometry) throw new Error('Gagal merakit geometri anatomi.')
        if (!cancelled) {
          setMerged({ geometry, parts, buffers })
          setOrganStatus(system, 'ready', 100)
        } else {
          geometry.dispose()
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Gagal memuat lapisan organ.')
          setOrganStatus(system, 'error')
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [system, setOrganStatus])

  useEffect(() => {
    return () => {
      setMerged((prev) => {
        prev?.geometry.dispose()
        return null
      })
    }
  }, [])

  const material = useMemo(() => {
    const transparent = system === 'integumentary'
    return new THREE.MeshStandardMaterial({
      color: ORGAN_META[system].color,
      roughness: 0.55,
      metalness: 0.05,
      side: THREE.DoubleSide,
      transparent,
      opacity: transparent ? 0.12 : 1,
      depthWrite: !transparent,
    })
  }, [system])

  useEffect(() => () => material.dispose(), [material])

  const selectedId = selectedOrgan?.id ?? null

  // Konsumsi antrian pick dari hasil pencarian: pilih part + minta fokus kamera.
  useEffect(() => {
    if (!pendingOrganPick || pendingOrganPick.system !== system || !merged) return
    const part = merged.parts.find((p) => p.id === pendingOrganPick.partId)
    if (!part) {
      setPendingOrganPick(null)
      return
    }
    setSelectedOrgan({ id: part.id, name: part.name, system: part.system })
    setSelected(null)
    setSelectedMesh(null)
    const cx = (part.bounds[0][0] + part.bounds[1][0]) / 2
    const cy = (part.bounds[0][1] + part.bounds[1][1]) / 2
    const cz = (part.bounds[0][2] + part.bounds[1][2]) / 2
    const size = Math.max(
      part.bounds[1][0] - part.bounds[0][0],
      part.bounds[1][1] - part.bounds[0][1],
      part.bounds[1][2] - part.bounds[0][2],
    )
    setFocusRequest({ point: [cx, cy, cz], size, token: Date.now() })
    setPendingOrganPick(null)
  }, [pendingOrganPick, merged, system, setSelectedOrgan, setSelected, setSelectedMesh, setFocusRequest, setPendingOrganPick])

  const overlay = useMemo(() => {
    if (!selectedId || !merged) return null
    const part = merged.parts.find((p) => p.id === selectedId)
    if (!part) return null
    const geometry = buildPartGeometry(merged.buffers.get(part.chunk)!, part)
    const mat = new THREE.MeshStandardMaterial({
      color: '#f59e0b',
      emissive: '#f59e0b',
      emissiveIntensity: 0.45,
      roughness: 0.5,
      metalness: 0.05,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -2,
    })
    return { geometry, material: mat }
  }, [selectedId, merged])

  useEffect(
    () => () => {
      overlay?.geometry.dispose()
      overlay?.material.dispose()
    },
    [overlay],
  )

  if (error || !frame || !merged) return null
  const visible = !isolatedSystem || isolatedSystem === system

  const pick = (faceIndex: number | null | undefined): AtlasPart | null => {
    if (faceIndex == null) return null
    const offset = faceIndex * 3
    let acc = 0
    for (const p of merged.parts) {
      acc += p.indexCount
      if (offset < acc) return p
    }
    return merged.parts[merged.parts.length - 1] ?? null
  }

  return (
    <group position={frame.offset} scale={frame.scale}>
      <mesh
        geometry={merged.geometry}
        material={material}
        visible={visible}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation()
          const part = pick(e.faceIndex)
          if (!part) return
          if (selectedId === part.id) {
            setSelectedOrgan(null)
          } else {
            setSelectedOrgan({ id: part.id, name: part.name, system: part.system })
            setSelected(null)
            setSelectedMesh(null)
          }
        }}
      />
      {overlay && visible && (
        <mesh geometry={overlay.geometry} material={overlay.material} raycast={() => undefined} />
      )}
    </group>
  )
}
