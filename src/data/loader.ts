import type { Manifest, BodyPart } from './schema'
import { ManifestSchema } from './schema'

export async function loadManifest(path: string = '/src/data/manifest.json'): Promise<Manifest> {
  const res = await fetch(path, { cache: 'no-store' })
  if (!res.ok) {
    throw new Error(`Failed to fetch manifest: ${res.status}`)
  }
  const data = (await res.json()) as Manifest
  const parsed = ManifestSchema.safeParse(data)
  if (!parsed.success) {
    console.error('Invalid manifest schema', parsed.error.format())
    throw new Error('Manifest schema validation failed')
  }
  return parsed.data
}

export function getBodyPartById(id: string, manifest: Manifest): BodyPart | undefined {
  return manifest.find((part) => part.id === id)
}

export function getPartsBySystem(system: string, manifest: Manifest): BodyPart[] {
  return manifest.filter((part) => part.sistem === system)
}