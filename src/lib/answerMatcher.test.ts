import { describe, expect, it } from 'vitest'
import { isAcceptedAnswer, normalize } from './answerMatcher'

const aliases = ['Udine', 'Udinese', 'Udinese Calcio']

describe('answer matcher', () => {
  it.each([
    'Udine',
    'UDINESE',
    'Udinese Calcio!',
    'Ich glaube, es ist Udinese Calcio',
    'Udinesse',
    'Udineze',
  ])('accepts a valid answer variant: %s', (guess) => {
    expect(isAcceptedAnswer(guess, aliases)).toBe(true)
  })

  it.each([
    '',
    'Juventus',
    'Inter Mailand',
    'Union Berlin',
    'Udi',
    'Das weiß ich nicht',
  ])('rejects an unrelated or ambiguous answer: %s', (guess) => {
    expect(isAcceptedAnswer(guess, aliases)).toBe(false)
  })

  it('normalizes punctuation, accents and whitespace', () => {
    expect(normalize('  Üdinése—Calcio! ')).toBe('udinese calcio')
  })
})
