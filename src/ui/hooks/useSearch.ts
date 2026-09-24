import { useEffect, useMemo, useState } from 'react'
import type { Manifest } from '../../data/schema'
import { searchParts } from '../../data/transform'
import { ORGAN_SYSTEMS, fetchAtlas } from '../../viewer/atlas/atlas'

export interface OrganMatch {
  id: string
  name: string
  system: string
}

// Pencarian manifest (sinkron) + organ atlas 2234 nama (async, cache modul).
// Hasil organ dibatasi 8 teratas agar daftar tetap ringkas.
export function useSearch(manifest: Manifest) {
  const [query, setQuery] = useState('')
  const [organs, setOrgans] = useState<OrganMatch[]>([])
  const [organsReady, setOrgansReady] = useState(false)

  const results = useMemo(() => {
    if (!query.trim()) return manifest
    return searchParts(query, manifest)
  }, [query, manifest])

  useEffect(() => {
    const q = query.trim().toLowerCase()
    if (q.length < 2) {
      setOrgans([])
      return
    }
    let cancelled = false
    fetchAtlas()
      .then((atlas) => {
        if (cancelled) return
        const hits = atlas.parts
          .filter(
            (p) =>
              (ORGAN_SYSTEMS as readonly string[]).includes(p.system) &&
              p.name.toLowerCase().includes(q),
          )
          .slice(0, 8)
          .map((p) => ({ id: p.id, name: p.name, system: p.system }))
        setOrgans(hits)
        setOrgansReady(true)
      })
      .catch(() => {
        if (!cancelled) setOrgans([])
      })
    return () => {
      cancelled = true
    }
  }, [query])

  return { query, setQuery, results, organs, organsReady }
}
