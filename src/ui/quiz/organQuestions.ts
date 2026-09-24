import {
  ORGAN_META,
  ORGAN_META_EN,
  ORGAN_SYSTEMS,
  fetchAtlas,
  organExplanation,
  organExplanationEn,
  type AtlasPart,
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

function distractorsFor(p: AtlasPart, pool: AtlasPart[], n: number): string[] {
  const same = shuffle(pool.filter((q) => q.id !== p.id && q.system === p.system))
  const names = same.slice(0, n).map((q) => q.name)
  if (names.length < n) {
    const fill = shuffle(pool.filter((q) => q.id !== p.id && q.system !== p.system))
      .slice(0, n - names.length)
      .map((q) => q.name)
    names.push(...fill)
  }
  return names
}

// Bank soal dari 2234 nama organ asli atlas (BodyParts3D). Mengembalikan null
// bila atlas tak terjangkau — pemanggil wajib fallback ke soal manifest.
export async function buildOrganQuestions(
  count = 5,
  lang: 'id' | 'en' = 'id',
): Promise<QuizQuestion[] | null> {
  try {
    const atlas = await fetchAtlas()
    const pool = atlas.parts.filter((p) =>
      (ORGAN_SYSTEMS as readonly string[]).includes(p.system),
    )
    if (pool.length < 8) return null
    const picked = shuffle(pool).slice(0, Math.min(count, pool.length))
    const meta = lang === 'en' ? ORGAN_META_EN : ORGAN_META
    const explain = lang === 'en' ? organExplanationEn : organExplanation
    return picked.map((p, i) => {
      const system = p.system as OrganSystemId
      if (i % 2 === 1) {
        const others = shuffle(ORGAN_SYSTEMS.filter((s) => s !== system)).slice(0, 3)
        return {
          partId: p.id,
          prompt:
            lang === 'en'
              ? `"${p.name}" belongs to which system?`
              : `"${p.name}" termasuk sistem apa?`,
          choices: shuffle([meta[system].nama, ...others.map((s) => meta[s].nama)]),
          answer: meta[system].nama,
        }
      }
      const same = shuffle(pool.filter((q) => q.id !== p.id && q.system === p.system)).slice(0, 3)
      const fill =
        same.length < 3
          ? shuffle(pool.filter((q) => q.id !== p.id && q.system !== p.system)).slice(0, 3 - same.length)
          : []
      return {
        partId: p.id,
        prompt:
          lang === 'en'
            ? `Which structure is this: "${truncate(explain(p.name, system), 160)}"?`
            : `Struktur apakah ini: "${truncate(explain(p.name, system), 160)}"?`,
        choices: shuffle([p.name, ...same.map((q) => q.name), ...fill.map((q) => q.name)]),
        answer: p.name,
      }
    })
  } catch {
    return null
  }
}

// Bank soal satu bab (satu sistem organ). Null bila atlas tak terjangkau.
export async function buildChapterQuestions(
  system: OrganSystemId,
  count = 5,
  lang: 'id' | 'en' = 'id',
): Promise<QuizQuestion[] | null> {
  try {
    const atlas = await fetchAtlas()
    const pool = atlas.parts.filter((p) => p.system === system)
    if (pool.length === 0) return null
    const picked = shuffle(pool).slice(0, Math.min(count, pool.length))
    const explain = lang === 'en' ? organExplanationEn : organExplanation
    return picked.map((p) => ({
      partId: p.id,
      prompt:
        lang === 'en'
          ? `Which structure is this: "${truncate(explain(p.name, system), 160)}"?`
          : `Struktur apakah ini: "${truncate(explain(p.name, system), 160)}"?`,
      choices: shuffle([p.name, ...distractorsFor(p, atlas.parts, 3)]),
      answer: p.name,
    }))
  } catch {
    return null
  }
}
