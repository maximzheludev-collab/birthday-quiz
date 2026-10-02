import type { QuizConfig } from '../config'

export const validateQuizConfig = (config: QuizConfig) => {
  const misleadingCount = config.clues.filter((clue) => clue.isMisleading).length
  if (misleadingCount !== 1) {
    throw new Error(`Das Quiz braucht genau einen irreführenden Hinweis (gefunden: ${misleadingCount}).`)
  }
  if (config.clues.length < 2) throw new Error('Das Quiz braucht mindestens zwei Hinweise.')
  if (!config.answer.aliases.length) throw new Error('Mindestens eine Antwortvariante fehlt.')
  if (!config.encouragements.length) throw new Error('Mindestens eine Aufmunterung fehlt.')
}
