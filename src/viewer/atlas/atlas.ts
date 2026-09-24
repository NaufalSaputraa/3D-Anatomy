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

// English names/descriptions mirroring ORGAN_META (for the ID/EN toggle).
export const ORGAN_META_EN: Record<OrganSystemId, { nama: string; deskripsi: string }> = {
  cardiac: {
    nama: 'Heart & Great Vessels',
    deskripsi: 'The heart is a four-chambered muscular pump. Its right side sends blood to the lungs; its left side to the whole body.',
  },
  respiratory: {
    nama: 'Respiratory',
    deskripsi: 'The airways conduct air to the lungs, where oxygen and carbon dioxide move between air and blood.',
  },
  digestive: {
    nama: 'Digestive',
    deskripsi: 'The digestive tract breaks down food, absorbs nutrients and water, and moves waste onward.',
  },
  nervous: {
    nama: 'Nervous',
    deskripsi: 'The brain, spinal cord, and peripheral nerves carry and process signals for movement, sensation, and coordination.',
  },
  muscular: {
    nama: 'Muscles',
    deskripsi: 'Skeletal muscles move bones by pulling on joints; they stabilize posture and produce body heat.',
  },
  arterial: {
    nama: 'Arteries',
    deskripsi: 'Vessels carrying blood away from the heart to supply oxygen to body tissues.',
  },
  venous: {
    nama: 'Veins',
    deskripsi: 'Vessels returning blood toward the heart from all body tissues.',
  },
  sensory: {
    nama: 'Sensory Organs',
    deskripsi: 'The sensory organs of sight, hearing, and balance that detect stimuli from outside.',
  },
  urinary: {
    nama: 'Urinary',
    deskripsi: 'The kidneys filter blood and regulate body fluids; urine flows to the bladder.',
  },
  lymphatic: {
    nama: 'Lymphatic',
    deskripsi: 'Lymph vessels return tissue fluid; lymph nodes play a role in immunity.',
  },
  endocrine: {
    nama: 'Endocrine',
    deskripsi: 'Hormone glands coordinating metabolism, growth, and stress responses.',
  },
  reproductive: {
    nama: 'Reproductive',
    deskripsi: 'Male reproductive organs in this reference model (sperm production and transport).',
  },
  integumentary: {
    nama: 'Body Surface',
    deskripsi: 'The skin as the outer protection of the body and anatomical surface reference.',
  },
  connective: {
    nama: 'Connective Tissue',
    deskripsi: 'Cartilage, ligaments, and tissues that stabilize joints.',
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

const ORGAN_EXPLANATIONS_EN: Record<string, string> = {
  heart: 'A muscular pump in the chest. Its right side sends blood to the lungs; its left side to the systemic circulation.',
  liver: 'A large organ beneath the right diaphragm. It processes nutrients, produces bile, and synthesizes blood proteins.',
  brain: 'The central organ of the nervous system, supporting perception, movement, memory, and language.',
  stomach: 'A muscular chamber between the esophagus and small intestine that stores and mixes food.',
  spleen: 'A lymphoid organ in the upper left abdomen that filters blood and supports immunity.',
  pancreas: 'An organ with digestive and endocrine roles, supplying enzymes and hormones including insulin.',
  trachea: 'The main airway connecting the larynx to the bronchi, held open by cartilage rings.',
  diaphragm: 'A broad muscle separating chest and abdomen; its contraction draws air into the lungs.',
  lung: 'The site of oxygen and carbon dioxide exchange between air and blood.',
  kidney: 'Filters blood and regulates fluids, electrolytes, and acid-base balance.',
  bladder: 'A muscular reservoir in the pelvis storing urine from the kidneys.',
  aorta: 'The largest artery, carrying oxygenated blood from the heart to the whole body.',
  artery: 'A vessel carrying blood away from the heart toward tissues.',
  vein: 'A vessel returning blood toward the heart.',
  nerve: 'Fibers conducting signals between the brain, spinal cord, and the body.',
  spinal: 'Nerves within the spine carrying movement and sensation signals.',
  muscle: 'Tissue that contracts to move bones and stabilize posture.',
  skin: 'The outermost protective layer; involved in sensation and temperature control.',
  eye: 'The visual organ capturing light as nerve signals.',
  ear: 'The organ of hearing and balance converting vibrations to nerve signals.',
  thyroid: 'A neck gland regulating the metabolic rate.',
  adrenal: 'Glands above the kidneys regulating stress response and blood pressure.',
  lymph: 'Part of the lymphatic system for immunity and tissue fluid circulation.',
}

export function organExplanationEn(name: string, system: OrganSystemId): string {
  const norm = name.toLowerCase()
  const keys = Object.keys(ORGAN_EXPLANATIONS_EN).sort((a, b) => b.length - a.length)
  for (const k of keys) {
    if (norm.includes(k)) return ORGAN_EXPLANATIONS_EN[k]
  }
  return ORGAN_META_EN[system].deskripsi
}

// Fakta kunci per bab belajar (3 per sistem, Bahasa Indonesia).
export const CHAPTER_FACTS: Record<OrganSystemId, string[]> = {
  cardiac: [
    'Jantung berdenyut sekitar 100 ribu kali setiap hari untuk memompa darah.',
    'Sisi kanan jantung memompa darah ke paru-paru; sisi kiri ke seluruh tubuh.',
    'Katup jantung memastikan darah mengalir satu arah dan tidak berbalik.',
  ],
  respiratory: [
    'Paru-paru kanan memiliki 3 lobus, sedangkan paru-paru kiri memiliki 2 lobus.',
    'Pertukaran oksigen dan karbon dioksida terjadi di kantung udara alveolus.',
    'Diafragma adalah otot utama yang menggerakkan pernapasan.',
  ],
  digestive: [
    'Hati adalah organ dalam terbesar; memproduksi empedu untuk mencerna lemak.',
    'Usus halus adalah tempat utama penyerapan nutrisi makanan.',
    'Lambung mencampur makanan dengan asam dan enzim sebelum diteruskan.',
  ],
  nervous: [
    'Otak manusia memiliki sekitar 86 miliar sel saraf (neuron).',
    'Sumsum tulang belakang menyalurkan sinyal gerak dan sensasi tubuh.',
    'Otak besar mengatur pikir, memori, bahasa, dan gerakan sadar.',
  ],
  muscular: [
    'Tubuh manusia memiliki lebih dari 600 otot rangka.',
    'Otot hanya bisa menarik, tidak mendorong — selalu bekerja berpasangan.',
    'Otot jantung dan otot polos bekerja tanpa perintah sadar.',
  ],
  arterial: [
    'Aorta adalah arteri terbesar, selebar ibu jari orang dewasa.',
    'Arteri memiliki dinding tebal dan elastis menahan tekanan denyut jantung.',
    'Arteri koroner memasok oksigen ke otot jantung itu sendiri.',
  ],
  venous: [
    'Vena memiliki katup pencegah darah berbalik arah ke kaki.',
    'Vena cava superior dan inferior adalah vena terbesar menuju jantung.',
    'Darah di sebagian besar vena miskin oksigen, kecuali vena paru.',
  ],
  sensory: [
    'Mata memiliki sekitar 120 juta sel fotoreseptor pendeteksi cahaya.',
    'Telinga dalam mengatur pendengaran sekaligus keseimbangan tubuh.',
    'Sinyal indera diteruskan saraf ke otak untuk ditafsirkan.',
  ],
  urinary: [
    'Setiap ginjal menyaring sekitar 180 liter darah per hari.',
    'Nefron adalah unit penyaring terkecil di dalam ginjal.',
    'Kandung kemih dapat menampung 300–500 ml urine.',
  ],
  lymphatic: [
    'Kelenjar getah bening menyaring cairan limfa dan menjebak kuman.',
    'Limpa menyaring darah dan membuang sel darah yang menua.',
    'Pembuluh limfa mengembalikan kelebihan cairan jaringan ke darah.',
  ],
  endocrine: [
    'Tiroid mengatur laju metabolisme seluruh tubuh.',
    'Insulin dari pankreas menurunkan kadar gula darah.',
    'Kelenjar adrenal mengatur respons stres dan tekanan darah.',
  ],
  reproductive: [
    'Model ini menampilkan anatomi reproduksi pria sebagai referensi.',
    'Testis memproduksi sperma dan hormon testosteron.',
    'Prostat menghasilkan cairan pelindung sperma.',
  ],
  integumentary: [
    'Kulit adalah organ terluas tubuh manusia, sekitar 2 meter persegi.',
    'Kulit mengatur suhu tubuh lewat keringat dan aliran darah.',
    'Lapisan kulit melindungi tubuh dari kuman dan cedera ringan.',
  ],
  connective: [
    'Ligamen menghubungkan tulang dengan tulang di sendi.',
    'Tulang rawan melapisi ujung tulang agar sendi bergerak licin.',
    'Tendon menghubungkan otot ke tulang untuk meneruskan tarikan.',
  ],
}

// English mirror of CHAPTER_FACTS.
export const CHAPTER_FACTS_EN: Record<OrganSystemId, string[]> = {
  cardiac: [
    'The heart beats about 100,000 times a day to pump blood.',
    'The right side pumps blood to the lungs; the left side to the whole body.',
    'Heart valves keep blood flowing one way without backflow.',
  ],
  respiratory: [
    'The right lung has 3 lobes, while the left lung has 2.',
    'Oxygen and carbon dioxide exchange happens in the alveoli air sacs.',
    'The diaphragm is the main muscle driving breathing.',
  ],
  digestive: [
    'The liver is the largest inner organ; it produces bile to digest fat.',
    'The small intestine is the main site of nutrient absorption.',
    'The stomach mixes food with acid and enzymes before passing it on.',
  ],
  nervous: [
    'The human brain has about 86 billion nerve cells (neurons).',
    'The spinal cord carries movement and sensation signals for the body.',
    'The cerebrum governs thought, memory, language, and conscious movement.',
  ],
  muscular: [
    'The human body has more than 600 skeletal muscles.',
    'Muscles can only pull, never push — they always work in pairs.',
    'Cardiac and smooth muscles work without conscious command.',
  ],
  arterial: [
    'The aorta is the largest artery, about as wide as an adult thumb.',
    'Arteries have thick elastic walls to withstand heartbeat pressure.',
    'Coronary arteries supply oxygen to the heart muscle itself.',
  ],
  venous: [
    'Veins have valves preventing blood from flowing back toward the legs.',
    'The superior and inferior vena cava are the largest veins to the heart.',
    'Most venous blood is oxygen-poor, except in the pulmonary veins.',
  ],
  sensory: [
    'The eye has about 120 million light-detecting photoreceptors.',
    'The inner ear governs hearing as well as body balance.',
    'Sensory signals travel through nerves to be interpreted by the brain.',
  ],
  urinary: [
    'Each kidney filters about 180 liters of blood per day.',
    'The nephron is the smallest filtering unit inside the kidney.',
    'The bladder can hold 300–500 ml of urine.',
  ],
  lymphatic: [
    'Lymph nodes filter lymph fluid and trap germs.',
    'The spleen filters blood and removes aging blood cells.',
    'Lymph vessels return excess tissue fluid to the blood.',
  ],
  endocrine: [
    'The thyroid sets the metabolic rate of the whole body.',
    'Pancreatic insulin lowers blood sugar levels.',
    'The adrenals govern stress response and blood pressure.',
  ],
  reproductive: [
    'This model shows male reproductive anatomy as reference.',
    'The testes produce sperm and the testosterone hormone.',
    'The prostate produces sperm-protecting fluid.',
  ],
  integumentary: [
    'The skin is the largest human organ, about 2 square meters.',
    'The skin regulates temperature through sweat and blood flow.',
    'Skin layers protect the body from germs and minor injury.',
  ],
  connective: [
    'Ligaments connect bone to bone at joints.',
    'Cartilage coats bone ends so joints move smoothly.',
    'Tendons connect muscle to bone to transmit pull.',
  ],
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
