import type { Manifest } from './schema'

export function searchParts(query: string, manifest: Manifest): Manifest {
  const lowerQuery = query.toLowerCase()
  return manifest.filter(
    (part) =>
      part.nama_id.toLowerCase().includes(lowerQuery) ||
      part.nama_en.toLowerCase().includes(lowerQuery) ||
      part.sistem.toLowerCase().includes(lowerQuery) ||
      part.deskripsi_id.toLowerCase().includes(lowerQuery)
  )
}

// Memetakan nama mesh 3D (mis. "body of sternum", "left_hip_bone") ke id
// entri manifest. Aturan keyword dari kaidah anatomi umum; fallback "tulang".
const MESH_RULES: Array<[RegExp, string]> = [
  [/skull|cranium|mandible|maxilla|zygomatic|nasal|occipital|parietal|frontal|temporal|sphenoid|ethmoid|vomer|palatine|lacrimal|hyoid|orbit|atlas|axis|odontoid/i, 'tengkorak'],
  [/rib|costa|sternum|xiphoid/i, 'tulang_rusuk'],
  [/vertebra|cervical|thoracic|lumbar|sacrum|coccyx|spine|pelvis|sacroiliac/i, 'tulang_belakang'],
]

export function meshNameToPartId(meshName: string): string {
  for (const [re, id] of MESH_RULES) {
    if (re.test(meshName)) return id
  }
  return 'tulang'
}

export interface BoneDetail {
  title: string
  latin: string
  region: string
  detail: string
}

const SIDE_ID: Record<string, string> = { left: 'Kiri', right: 'Kanan' }
const SEGMENT_ID: Record<string, string> = { proximal: 'proksimal', distal: 'distal', middle: 'tengah' }

const BONE_ID: Record<string, string> = {
  metacarpal: 'tulang telapak tangan',
  metatarsal: 'tulang telapak kaki',
  phalanx: 'ruas jari',
  carpal: 'tulang pergelangan tangan',
  tarsal: 'tulang pergelangan kaki',
  femur: 'tulang paha',
  tibia: 'tulang kering',
  fibula: 'tulang betis',
  patella: 'tempurung lutut',
  humerus: 'tulang lengan atas',
  radius: 'tulang pengumpil',
  ulna: 'tulang hasta',
  clavicle: 'tulang selangka',
  scapula: 'tulang belikat',
  sternum: 'tulang dada',
  sacrum: 'tulang kelangkang',
  coccyx: 'tulang ekor',
  mandible: 'tulang rahang bawah',
  maxilla: 'tulang rahang atas',
  cranium: 'tulang tengkorak',
  skull: 'tulang tengkorak',
  vertebra: 'tulang belakang',
  rib: 'tulang rusuk',
  pelvis: 'tulang panggul',
}

const DIGIT_ID: Record<string, string> = {
  thumb: 'ibu jari',
  index: 'telunjuk',
  middle: 'tengah',
  ring: 'manis',
  little: 'kelingking',
}

const BONE_ROLE: Record<string, string> = {
  femur: 'tulang terpanjang dan terkuat di tubuh; menopang berat badan saat berdiri dan berjalan',
  tibia: 'menopang berat badan dan membentuk sendi lutut serta pergelangan kaki',
  fibula: 'menstabilkan pergelangan kaki dan menjadi tempat melekatnya otot betis',
  patella: 'melindungi sendi lutut dan memperkuat kerja otot paha saat menekuk kaki',
  humerus: 'menghubungkan bahu ke siku dan menjadi tumpuan otot lengan atas',
  radius: 'tulang sisi ibu jari yang memungkinkan gerakan memutar pergelangan tangan',
  ulna: 'membentuk sendi siku bersama humerus',
  clavicle: 'menghubungkan lengan ke rangka dada dan menstabilkan bahu',
  scapula: 'tulang pipih tempat melekatnya otot bahu dan lengan',
  sternum: 'melindungi jantung dan paru-paru serta menjadi tempat menempelnya tulang rusuk',
  rib: 'melindungi jantung dan paru-paru',
  vertebra: 'melindungi sumsum tulang belakang dan menopang postur tubuh',
  sacrum: 'menghubungkan tulang belakang ke panggul dan meneruskan berat tubuh bagian atas',
  coccyx: 'tumpuan saat duduk dan tempat melekatnya otot dasar panggul',
  pelvis: 'melindungi organ panggul dan menjadi tumpuan tubuh saat duduk serta berjalan',
  mandible: 'satu-satunya tulang tengkorak yang bisa bergerak; berperan dalam mengunyah dan berbicara',
  maxilla: 'membentuk rahang atas dan dasar rongga hidung serta rongga mata',
  skull: 'melindungi otak',
  cranium: 'melindungi otak',
  carpal: 'memberi kelenturan pada pergelangan tangan',
  tarsal: 'menyerap benturan saat berjalan dan menopang lengkung kaki',
  metacarpal: 'membentuk telapak tangan dan pangkal jari-jari tangan',
  metatarsal: 'membentuk telapak kaki dan menopang berat badan saat melangkah',
}

const REGION_RULES: Array<[RegExp, string]> = [
  [/finger|thumb|carpal|metacarpal/i, 'Tangan'],
  [/toe|tarsal|metatarsal/i, 'Kaki'],
  [/humerus|radius|ulna|clavicle|scapula/i, 'Lengan'],
  [/femur|tibia|fibula|patella/i, 'Tungkai'],
  [/skull|cranium|mandible|maxilla|zygomatic|nasal|occipital|parietal|frontal|temporal|orbit/i, 'Kepala'],
  [/rib|costa|sternum|thoracic|xiphoid/i, 'Dada'],
  [/vertebra|cervical|lumbar|sacrum|coccyx|spine/i, 'Tulang Belakang'],
  [/\bhip\b|pelvis|ilium|ischium|pubis/i, 'Panggul'],
]

const REGION_EN: Record<string, string> = {
  Tangan: 'Hand',
  Kaki: 'Foot',
  Lengan: 'Arm',
  Tungkai: 'Leg',
  Kepala: 'Head',
  Dada: 'Chest',
  'Tulang Belakang': 'Spine',
  Panggul: 'Pelvis',
  Rangka: 'Skeleton',
}

const BONE_ROLE_EN: Record<string, string> = {
  femur: 'the longest and strongest bone in the body, supporting body weight when standing and walking',
  tibia: 'supports body weight and forms the knee and ankle joints',
  fibula: 'stabilizes the ankle and anchors the calf muscles',
  patella: 'protects the knee joint and strengthens thigh muscle action',
  humerus: 'connects the shoulder to the elbow and anchors upper-arm muscles',
  radius: 'the thumb-side bone enabling wrist rotation',
  ulna: 'forms the elbow joint together with the humerus',
  clavicle: 'connects the arm to the chest and stabilizes the shoulder',
  scapula: 'a flat bone anchoring shoulder and arm muscles',
  sternum: 'protects the heart and lungs and anchors the ribs',
  rib: 'protects the heart and lungs',
  vertebra: 'protects the spinal cord and supports posture',
  sacrum: 'connects the spine to the pelvis, transferring upper-body weight',
  coccyx: 'supports sitting and anchors pelvic floor muscles',
  pelvis: 'protects pelvic organs and supports the body when sitting and walking',
  mandible: 'the only movable skull bone, used for chewing and speaking',
  maxilla: 'forms the upper jaw and the floor of the nasal and eye cavities',
  skull: 'protects the brain',
  cranium: 'protects the brain',
  carpal: 'gives flexibility to the wrist',
  tarsal: 'absorbs impact when walking and supports the foot arch',
  metacarpal: 'forms the palm and the base of the fingers',
  metatarsal: 'forms the sole and supports weight when stepping',
}

function titleCase(s: string): string {
  return s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
}

function prettyMeshName(name: string): string {
  return titleCase(name.replace(/[_-]+/g, ' ').trim())
}

function findKey(norm: string, dict: Record<string, string>): string | null {
  const keys = Object.keys(dict).sort((a, b) => b.length - a.length)
  for (const k of keys) {
    if (norm.includes(k)) return k
  }
  return null
}

// Mengurai nama mesh Inggris (mis. "proximal_phalanx_of_left_little_finger")
// menjadi judul + deskripsi spesifik per tulang (ID/EN via lang).
export function describeBone(meshName: string, lang: 'id' | 'en' = 'id'): BoneDetail {
  const latin = prettyMeshName(meshName)
  const norm = meshName.toLowerCase().replace(/[_-]+/g, ' ')
  const tokens = new Set(norm.split(/\s+/))

  const sideKey = tokens.has('left') ? 'left' : tokens.has('right') ? 'right' : null
  const side = sideKey ? SIDE_ID[sideKey] : null
  const segmentKey = tokens.has('proximal') ? 'proximal' : tokens.has('distal') ? 'distal' : tokens.has('middle') ? 'middle' : null

  const boneKey = findKey(norm, BONE_ID)
  const regionEntry = REGION_RULES.find(([re]) => re.test(norm))
  const region = regionEntry ? regionEntry[1] : 'Rangka'

  if (!boneKey) {
    if (lang === 'en') {
      return {
        title: latin,
        latin,
        region: REGION_EN[region] ?? 'Skeleton',
        detail: `${latin}${sideKey ? ` on the ${sideKey} side` : ''} is one of the 201 bones in this skeletal model.`,
      }
    }
    return {
      title: latin,
      latin,
      region,
      detail: `${latin}${side ? ` sisi ${side.toLowerCase()}` : ''} adalah salah satu dari 201 tulang penyusun kerangka dalam model ini.`,
    }
  }

  const boneId = BONE_ID[boneKey]
  const isToe = tokens.has('toe') || tokens.has('toes')

  if (boneKey === 'phalanx') {
    const digitKey = findKey(norm, DIGIT_ID)
    if (lang === 'en') {
      const dEn = digitKey ?? (isToe ? 'toe' : 'finger')
      const segEn = segmentKey ? `${titleCase(segmentKey)} ` : ''
      const sideEn = sideKey ? ` ${titleCase(sideKey)}` : ''
      const limbEn = isToe ? 'Toe' : 'Finger'
      const moveEn = isToe ? 'stepping and balance' : 'fine movement and grip'
      return {
        title: `${segEn}Phalanx of the${sideEn} ${titleCase(dEn)} ${limbEn}`,
        latin,
        region: REGION_EN[region] ?? 'Skeleton',
        detail: `The ${segmentKey ? `${segmentKey} ` : ''}phalanx of the${sideKey ? ` ${sideKey}` : ''} ${dEn} ${limbEn.toLowerCase()}. Together with the other phalanges it forms the framework of the ${limbEn.toLowerCase()} for ${moveEn}.`,
      }
    }
    const digit = digitKey ? DIGIT_ID[digitKey] : 'jari'
    const jari = isToe ? 'Jari Kaki' : 'Jari Tangan'
    const seg = segmentKey ? ` ${titleCase(SEGMENT_ID[segmentKey])}` : ''
    const title = `Ruas ${jari}${seg} ${titleCase(digit)}${side ? ` ${side}` : ''}`
    const gerak = isToe ? 'menapak dan menjaga keseimbangan' : 'gerakan halus dan genggaman'
    return {
      title,
      latin,
      region,
      detail:
        `${title} adalah tulang ruas ${digit.toLowerCase()}${side ? ` ${side.toLowerCase()}` : ''}` +
        `${segmentKey ? ` bagian ${SEGMENT_ID[segmentKey]}` : ''}. ` +
        `Bersama ruas lainnya, tulang ini membentuk kerangka ${jari.toLowerCase()} untuk ${gerak}.`,
    }
  }

  if (lang === 'en') {
    const roleEn = BONE_ROLE_EN[boneKey]
    const titleEn = `${titleCase(boneKey)}${sideKey ? ` (${titleCase(sideKey)})` : ''}`
    return {
      title: titleEn,
      latin,
      region: REGION_EN[region] ?? 'Skeleton',
      detail: roleEn
        ? `${titleEn} is ${roleEn}.`
        : `${titleEn} is part of the ${(REGION_EN[region] ?? 'skeleton').toLowerCase()} skeleton.`,
    }
  }

  const role = BONE_ROLE[boneKey]
  const title = `${titleCase(boneId)}${side ? ` ${side}` : ''}`
  const detail = role
    ? `${title} adalah ${boneId}${side ? ` sisi ${side.toLowerCase()}` : ''} yang ${role}.`
    : `${title} adalah ${boneId}${side ? ` sisi ${side.toLowerCase()}` : ''}, bagian dari kerangka ${region.toLowerCase()}.`

  return { title, latin, region, detail }
}