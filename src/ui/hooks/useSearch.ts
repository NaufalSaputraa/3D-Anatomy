import { useMemo, useState } from 'react'
import type { Manifest } from '../../data/schema'
import { searchParts } from '../../data/transform'

export function useSearch(manifest: Manifest) {
  const [query, setQuery] = useState('')
  const results = useMemo(() => {
    if (!query.trim()) return manifest
    return searchParts(query, manifest)
  }, [query, manifest])
  return { query, setQuery, results }
}
