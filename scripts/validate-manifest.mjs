import { readFile } from 'fs/promises'

const REQUIRED_FIELDS = ['id', 'nama_id', 'nama_en', 'sistem', 'deskripsi_id']

async function validate() {
  try {
    const manifest = JSON.parse(await readFile('src/data/manifest.json', 'utf-8'))
    const parts = manifest

    if (!Array.isArray(parts)) {
      console.error('Manifest is not an array')
      process.exit(1)
    }

    const idSet = new Set()

    for (const part of parts) {
      // Check required fields
      for (const field of REQUIRED_FIELDS) {
        if (!(field in part)) {
          console.error(`Missing required field: ${field} in part ${JSON.stringify(part)}`)
          process.exit(1)
        }
      }

      // Check id uniqueness
      if (idSet.has(part.id)) {
        console.error(`Duplicate id: ${part.id}`)
        process.exit(1)
      }
      idSet.add(part.id)
    }

    console.log(`Manifest validated successfully: ${parts.length} body parts`)
    process.exit(0)
  } catch (error) {
    console.error('Validation error:', error.message)
    process.exit(1)
  }
}

validate()