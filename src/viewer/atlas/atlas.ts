import * as THREE from 'three'

// Lapisan organ dari atlas human-atlas (ashemag, MIT) berbasis data
// BodyParts3D 4.0 (CC BY 4.0). Geometri di-fetch saat runtime dari upstream
// agar repo tetap ringan; lihat public/ATTRIBUTION.md.
export const ATLAS_BASE =
  'https://raw.githubusercontent.com/ashemag/human-atlas/main/public'

export type OrganSystemId =
  | 'cardiac'
  | 'respiratory'
  | 'digestive'
  | 'nervous'
  | 'muscular'
  | 'arterial'
  | 'venous'
  | 'sensory'
  | 'urinary'
  | 'lymphatic'
  | 'endocrine'
  | 'reproductive'
  | 'integumentary'
  | 'connective'

export const ORGAN_SYSTEMS: OrganSystemId[] = [
  'cardiac',
  'respiratory',
  'digestive',
  'nervous',
  'muscular',
  'arterial',
  'venous',
  'sensory',
  'urinary',
  'lymphatic',
  'endocrine',
  'reproductive',
  'integumentary',
  'connective',
]

export interface AtlasPart {
  id: string
  name: string
  conceptId: string
  system: string
  chunk: number
  positions: number
  normals: number
  indices: number
  vertexCount: number
  indexCount: number
  bounds: [number[], number[]]
}

export interface AtlasChunk {
  url: string
  bytes: number
  gzip?: string
  gzipBytes?: number
}

export interface AtlasData {
  parts: AtlasPart[]
  chunks: AtlasChunk[]
}

export interface OrganMeta {
  nama: string
  deskripsi: string
  color: string
}

// Warna diadopsi dari palet human-atlas (MIT, tercantum di ATTRIBUTION).
export const ORGAN_META: Record<OrganSystemId, OrganMeta> = {
  cardiac: {
    nama: 'Jantung & Pembuluh Besar',
    deskripsi: 'Jantung adalah pompa otot beruang empat. Sisi kanan mengalirkan darah ke paru-paru; sisi kiri ke seluruh tubuh.',
    color: '#b96760',
  },
  respiratory: {
    nama: 'Pernapasan',
    deskripsi: 'Saluran napas menghantar udara ke paru-paru, tempat oksigen dan karbon dioksida bertukar antara udara dan darah.',
    color: '#b98991',
  },
  digestive: {
    nama: 'Pencernaan',
    deskripsi: 'Saluran cerna mengurai makanan, menyerap nutrisi dan air. Organ tambahan menyumbang empedu dan enzim pencernaan.',
    color: '#b8916b',
  },
  nervous: {
    nama: 'Saraf',
    deskripsi: 'Otak, sumsum tulang belakang, dan saraf tepi membawa dan memproses sinyal untuk gerak, sensasi, dan koordinasi.',
    color: '#d8b565',
  },
  muscular: {
    nama: 'Otot',
    deskripsi: 'Otot rangka menggerakkan tulang dengan menarik sendi; menstabilkan postur dan menghasilkan panas tubuh.',
    color: '#a85b50',
  },
  arterial: {
    nama: 'Arteri',
    deskripsi: 'Pembuluh yang membawa darah menjauhi jantung untuk memasok oksigen ke jaringan tubuh.',
    color: '#c05245',
  },
  venous: {
    nama: 'Vena',
    deskripsi: 'Pembuluh yang mengembalikan darah menuju jantung dari seluruh jaringan tubuh.',
    color: '#527c9f',
  },
  sensory: {
    nama: 'Indera',
    deskripsi: 'Organ indera penglihatan, pendengaran, dan keseimbangan yang mendeteksi rangsang dari luar.',
    color: '#b0c8ce',
  },
  urinary: {
    nama: 'Kemih',
    deskripsi: 'Ginjal menyaring darah dan mengatur cairan tubuh; urine disalurkan ke kandung kemih.',
    color: '#b47961',
  },
  lymphatic: {
    nama: 'Limfatik',
    deskripsi: 'Pembuluh limfa mengembalikan cairan jaringan; kelenjar getah bening berperan dalam imunitas.',
    color: '#879f7c',
  },
  endocrine: {
    nama: 'Endokrin',
    deskripsi: 'Kelenjar hormon yang mengoordinasikan metabolisme, pertumbuhan, dan respons stres.',
    color: '#c5a09a',
  },
  reproductive: {
    nama: 'Reproduksi',
    deskripsi: 'Organ reproduksi pria pada model referensi ini (produksi dan transpor sperma serta hormon).',
    color: '#bda098',
  },
  integumentary: {
    nama: 'Permukaan Tubuh',
    deskripsi: 'Kulit sebagai pelindung luar tubuh sekaligus referensi permukaan anatomi.',
    color: '#ba9b7d',
  },
  connective: {
    nama: 'Jaringan Ikat',
    deskripsi: 'Tulang rawan, ligamen, dan jaringan penyambung yang menstabilkan sendi.',
    color: '#aec3bb',
  },
}

// Manifest lokal (tangan) -> lapisan organ 3D yang meng-cover-nya.
export const MANIFEST_ORGAN_LAYER: Record<string, OrganSystemId> = {
  jantung: 'cardiac',
  paru_kanan: 'respiratory',
  paru_kiri: 'respiratory',
  hati: 'digestive',
  lambung: 'digestive',
  usus_halus: 'digestive',
  otak: 'nervous',
  otot_bisep: 'muscular',
  pembuluh_darah: 'arterial',
  ginjal: 'urinary',
  kulit: 'integumentary',
  mata: 'sensory',
}

const ORGAN_EXPLANATIONS: Record<string, string> = {
  heart: 'Pompa otot di rongga dada. Sisi kanan mengirim darah ke paru-paru; sisi kiri ke sirkulasi seluruh tubuh.',
  liver: 'Organ besar di bawah diafragma kanan. Mengolah nutrisi, memproduksi empedu, dan mensintesis protein darah.',
  brain: 'Organ pusat sistem saraf. Mendukung persepsi, gerak, memori, bahasa, dan pengaturan fungsi tubuh.',
  stomach: 'Ruang otot antara kerongkongan dan usus halus. Menyimpan dan mencampur makanan sebelum diteruskan.',
  spleen: 'Organ limfoid di perut kiri atas. Menyaring darah dan berperan dalam imunitas.',
  pancreas: 'Berperan ganda: enzim pencernaan untuk usus halus dan hormon seperti insulin.',
  trachea: 'Saluran napas utama penghubung laring ke bronkus; cincin kartilago menjaganya tetap terbuka.',
  diaphragm: 'Otot lebar pemisah dada dan perut; kontraksinya menarik udara masuk ke paru-paru.',
  lung: 'Tempat pertukaran oksigen dan karbon dioksida antara udara dan darah.',
  kidney: 'Menyaring darah serta mengatur cairan, elektrolit, dan keseimbangan asam-basa.',
  bladder: 'Kantung otot di panggul yang menampung urine dari ginjal melalui ureter.',
  aorta: 'Arteri terbesar tubuh; membawa darah beroksigen dari jantung ke seluruh tubuh.',
  artery: 'Pembuluh yang membawa darah menjauhi jantung menuju jaringan.',
  vein: 'Pembuluh yang mengembalikan darah menuju jantung.',
  nerve: 'Serabut penghantar sinyal antara otak, sumsum tulang belakang, dan seluruh tubuh.',
  spinal: 'Rangkaian saraf di dalam tulang belakang yang menyalurkan sinyal gerak dan sensasi.',
  muscle: 'Jaringan otot yang berkontraksi untuk menggerakkan tulang dan menstabilkan postur.',
  skin: 'Lapisan pelindung terluar tubuh; berperan dalam sensasi dan pengaturan suhu.',
  eye: 'Organ penglihatan yang menangkap cahaya dan meneruskannya sebagai sinyal saraf.',
  ear: 'Organ pendengaran dan keseimbangan yang mengubah getaran menjadi sinyal saraf.',
  thyroid: 'Kelenjar hormon di leher yang mengatur laju metabolisme tubuh.',
  adrenal: 'Kelenjar di atas ginjal yang mengatur respons stres dan tekanan darah.',
  lymph: 'Bagian dari sistem limfatik untuk imunitas dan peredaran cairan jaringan.',
}

export function organExplanation(name: string, system: OrganSystemId): string {
  const norm = name.toLowerCase()
  const keys = Object.keys(ORGAN_EXPLANATIONS).sort((a, b) => b.length - a.length)
  for (const k of keys) {
    if (norm.includes(k)) return ORGAN_EXPLANATIONS[k]
  }
  return ORGAN_META[system].deskripsi
}

let atlasPromise: Promise<AtlasData> | null = null

export function fetchAtlas(): Promise<AtlasData> {
  if (!atlasPromise) {
    atlasPromise = fetch(`${ATLAS_BASE}/models/atlas.json`).then(async (res) => {
      if (!res.ok) throw new Error('Berkas atlas anatomi tidak bisa dimuat.')
      const data = (await res.json()) as AtlasData
      if (!Array.isArray(data.parts) || !Array.isArray(data.chunks)) {
        throw new Error('Format atlas anatomi tidak dikenali.')
      }
      return data
    })
    atlasPromise.catch(() => {
      atlasPromise = null
    })
  }
  return atlasPromise
}

const chunkCache = new Map<number, Promise<ArrayBuffer>>()

// Port decodeModelResponse human-atlas (MIT): hormati payload yang sudah
// di-decode fetch, verifikasi panjang byte agar geometri tidak korup.
async function decodeChunk(buffer: ArrayBuffer, expectedBytes: number, compressed: boolean): Promise<ArrayBuffer> {
  const sig = new Uint8Array(buffer, 0, Math.min(2, buffer.byteLength))
  const gzipped = compressed && sig[0] === 0x1f && sig[1] === 0x8b
  const out = gzipped
    ? await new Response(new Blob([buffer]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer()
    : buffer
  if (out.byteLength !== expectedBytes) {
    throw new Error('Berkas anatomi tidak lengkap. Muat ulang penampil.')
  }
  return out
}

export function fetchChunk(ci: number, chunks: AtlasChunk[]): Promise<ArrayBuffer> {
  const cached = chunkCache.get(ci)
  if (cached) return cached
  const chunk = chunks[ci]
  const useGzip = !!chunk.gzip && typeof DecompressionStream !== 'undefined'
  // chunk.url / chunk.gzip di atlas.json sudah berbentuk path absolut
  // "/models/..." relatif ke public/ — ditempel langsung ke ATLAS_BASE.
  const path = useGzip ? chunk.gzip! : chunk.url
  const p = fetch(`${ATLAS_BASE}${path}`).then(async (res) => {
    if (!res.ok) throw new Error('Berkas anatomi tidak bisa dimuat.')
    const payload = await res.arrayBuffer()
    return decodeChunk(payload, chunk.bytes, useGzip)
  })
  p.catch(() => {
    chunkCache.delete(ci)
  })
  chunkCache.set(ci, p)
  return p
}

// Layout binari authoritative (app/scene.tsx human-atlas, MIT):
// posisi float32 x3, normal int16 ternormalisasi x3, indeks uint32.
export function buildPartGeometry(buffer: ArrayBuffer, part: AtlasPart): THREE.BufferGeometry {
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(buffer, part.positions, part.vertexCount * 3), 3))
  g.setAttribute('normal', new THREE.BufferAttribute(new Int16Array(buffer, part.normals, part.vertexCount * 3), 3, true))
  g.setIndex(new THREE.BufferAttribute(new Uint32Array(buffer, part.indices, part.indexCount), 1))
  g.boundingBox = new THREE.Box3(
    new THREE.Vector3().fromArray(part.bounds[0]),
    new THREE.Vector3().fromArray(part.bounds[1]),
  )
  g.computeBoundingSphere()
  return g
}

export interface AtlasFrame {
  offset: [number, number, number]
  scale: number
}

// Menyamakan ruang koordinat organ (meter, berdiri di tanah) dengan skeleton
// yang sudah dinormalisasi (tinggi 2 unit, center di origin). Frame dihitung
// dari gabungan bounds SELURUH part agar konsisten antar lapisan lazy.
export function computeAtlasFrame(parts: AtlasPart[], targetHeight = 2): AtlasFrame {
  const min = [Infinity, Infinity, Infinity]
  const max = [-Infinity, -Infinity, -Infinity]
  for (const p of parts) {
    for (let i = 0; i < 3; i++) {
      min[i] = Math.min(min[i], p.bounds[0][i])
      max[i] = Math.max(max[i], p.bounds[1][i])
    }
  }
  const size = max.map((v, i) => v - min[i])
  const s = targetHeight / Math.max(...size)
  const center = min.map((v, i) => (v + max[i]) / 2)
  return {
    offset: [-center[0] * s, -center[1] * s, -center[2] * s],
    scale: s,
  }
}
