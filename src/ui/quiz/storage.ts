import type { QuizResult } from './types'

const KEY_PREFIX = 'anatomy-quiz-best-v1'

function keyFor(chapter?: string | null): string {
  return chapter ? `${KEY_PREFIX}:${chapter}` : KEY_PREFIX
}

export function loadBest(chapter?: string | null): QuizResult | null {
  try {
    const raw = localStorage.getItem(keyFor(chapter))
    if (!raw) return null
    const data = JSON.parse(raw) as QuizResult
    if (typeof data.score !== 'number' || typeof data.total !== 'number') return null
    return data
  } catch {
    return null
  }
}

export function saveResult(r: QuizResult, chapter?: string | null): void {
  try {
    const prev = loadBest(chapter)
    if (!prev || r.score > prev.score || (r.score === prev.score && r.total > prev.total)) {
      localStorage.setItem(keyFor(chapter), JSON.stringify(r))
    }
  } catch {
    // abaikan: progres tidak tersimpan, kuis tetap jalan
  }
}

export function clearBest(): void {
  try {
    const doomed: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k && (k === KEY_PREFIX || k.startsWith(`${KEY_PREFIX}:`))) doomed.push(k)
    }
    doomed.forEach((k) => localStorage.removeItem(k))
  } catch {
    // abaikan
  }
}
