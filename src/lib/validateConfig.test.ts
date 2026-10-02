import { describe, expect, it } from 'vitest'
import { quizConfig, type QuizConfig } from '../config'
import { validateQuizConfig } from './validateConfig'

const withClues = (clues: QuizConfig['clues']): QuizConfig => ({ ...quizConfig, clues })

describe('quiz configuration', () => {
  it('accepts the shipped configuration', () => {
    expect(() => validateQuizConfig(quizConfig)).not.toThrow()
  })

  it('requires exactly one misleading clue', () => {
    expect(() => validateQuizConfig(withClues([
      { text: 'A', isMisleading: false },
      { text: 'B', isMisleading: false },
    ]))).toThrow(/genau einen/)

    expect(() => validateQuizConfig(withClues([
      { text: 'A', isMisleading: true },
      { text: 'B', isMisleading: true },
    ]))).toThrow(/genau einen/)
  })
})
