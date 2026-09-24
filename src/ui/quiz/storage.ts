import type { QuizResult } from './types'

const KEY = 'anatomy-quiz-best-v1'

export function loadBest(): QuizResult | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as QuizResult
    if (typeof data.score !== 'number' || typeof data.total !== 'number') return null
    return data
  } catch {
    return null
  }
}

export function saveResult(r: QuizResult): void {
  try {
    const prev = loadBest()
    if (!prev || r.score > prev.score || (r.score === prev.score && r.total > prev.total)) {
      localStorage.setItem(KEY, JSON.stringify(r))
    }
  } catch {
    // abaikan: progres tidak tersimpan, kuis tetap jalan
  }
}

export function clearBest(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // abaikan
  }
}
