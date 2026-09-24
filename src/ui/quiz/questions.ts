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

export function generateQuestions(manifest: Manifest, count = 5): QuizQuestion[] {
  const picked = shuffle(manifest).slice(0, Math.min(count, manifest.length))
  return picked.map((part) => {
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
