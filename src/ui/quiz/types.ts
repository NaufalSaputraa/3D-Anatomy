export interface QuizQuestion {
  partId: string
  prompt: string
  choices: string[]
  answer: string
}

export interface QuizResult {
  score: number
  total: number
  date: string
}
