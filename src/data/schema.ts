/** Zod schemas for 3D Anatomy manifest */
import { z } from 'zod'

export const BodyPartSchema = z.object({
  id: z.string(),
  nama_id: z.string(),
  nama_en: z.string(),
  sistem: z.string(),
  deskripsi_id: z.string(),
})

export type BodyPart = z.infer<typeof BodyPartSchema>

export const ManifestSchema = z.array(BodyPartSchema)
export type Manifest = z.infer<typeof ManifestSchema>