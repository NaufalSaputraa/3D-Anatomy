import {
  ORGAN_META,
  ORGAN_SYSTEMS,
  fetchAtlas,
  organExplanation,
  type OrganSystemId,
} from '../../viewer/atlas/atlas'
import type { QuizQuestion } from './types'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function truncate(s: string, n: number): string {
  return s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s
}

// Bank soal dari 2234 nama organ asli atlas (BodyParts3D). Mengembalikan null
// bila atlas tak terjangkau — pemanggil wajib fallback ke soal manifest.
export async function buildOrganQuestions(count = 5): Promise<QuizQuestion[] | null> {
  try {
    const atlas = await fetchAtlas()
    const pool = atlas.parts.filter((p) =>
      (ORGAN_SYSTEMS as readonly string[]).includes(p.system),
    )
    if (pool.length < 8) return null
    const picked = shuffle(pool).slice(0, Math.min(count, pool.length))
    return picked.map((p, i) => {
      const system = p.system as OrganSystemId
      if (i % 2 === 1) {
        const others = shuffle(ORGAN_SYSTEMS.filter((s) => s !== system)).slice(0, 3)
        return {
          partId: p.id,
          prompt: `"${p.name}" termasuk sistem apa?`,
          choices: shuffle([ORGAN_META[system].nama, ...others.map((s) => ORGAN_META[s].nama)]),
          answer: ORGAN_META[system].nama,
        }
      }
      const same = shuffle(pool.filter((q) => q.id !== p.id && q.system === p.system)).slice(0, 3)
      const fill =
        same.length < 3
          ? shuffle(pool.filter((q) => q.id !== p.id && q.system !== p.system)).slice(0, 3 - same.length)
          : []
      return {
        partId: p.id,
        prompt: `Struktur apakah ini: "${truncate(organExplanation(p.name, system), 160)}"?`,
        choices: shuffle([p.name, ...same.map((q) => q.name), ...fill.map((q) => q.name)]),
        answer: p.name,
      }
    })
  } catch {
    return null
  }
}
