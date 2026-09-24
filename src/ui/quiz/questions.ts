import type { Manifest } from '../../data/schema'
import type { QuizQuestion } from './types'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function generateQuestions(
  manifest: Manifest,
  count = 5,
  lang: 'id' | 'en' = 'id',
): QuizQuestion[] {
  const picked = shuffle(manifest).slice(0, Math.min(count, manifest.length))
  return picked.map((part) => {
    if (lang === 'en') {
      const distractors = shuffle(manifest.filter((m) => m.id !== part.id))
        .slice(0, 3)
        .map((m) => m.nama_en)
      return {
        partId: part.id,
        prompt: `What is the English name for "${part.nama_id}"?`,
        choices: shuffle([part.nama_en, ...distractors]),
        answer: part.nama_en,
      }
    }
    const distractors = shuffle(manifest.filter((m) => m.id !== part.id))
      .slice(0, 3)
      .map((m) => m.nama_id)
    return {
      partId: part.id,
      prompt: `Apa nama Indonesia dari "${part.nama_en}"?`,
      choices: shuffle([part.nama_id, ...distractors]),
      answer: part.nama_id,
    }
  })
}
