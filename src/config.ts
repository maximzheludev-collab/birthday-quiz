/**
 * Alle später austauschbaren Quiz-Inhalte befinden sich in dieser Datei.
 * Vor dem Veröffentlichen: Platzhalter ersetzen und genau einen Hinweis mit
 * `isMisleading: true` markieren.
 */
export type QuizClue = {
  text: string
  isMisleading: boolean
}

export type QuizConfig = {
  player: { name: string; age: number }
  intro: { eyebrow: string; title: string; text: string }
  clues: QuizClue[]
  answer: { canonical: string; aliases: string[] }
  encouragements: string[]
  success: { eyebrow: string; title: string; message: string }
}

export const quizConfig: QuizConfig = {
  player: { name: 'Philipp', age: 15 },
  intro: {
    eyebrow: 'Dein Geburtstags-Spezial',
    title: 'Bereit für die Fußball-Challenge?',
    text: 'Fünf Hinweise. Einer davon führt dich absichtlich aufs Glatteis. Welchen Verein suchen wir?',
  },
  clues: [
    { text: 'Wir waren bereits im Stadion dieses Vereins.', isMisleading: false },
    { text: 'Wir haben bereits ein Spiel gesehen, an dem dieser Verein beteiligt war.', isMisleading: false },
    { text: 'Dieser Verein hat die UEFA Champions League fünfmal gewonnen.', isMisleading: true },
    { text: 'Am 20. Oktober 2011 besiegte dieser Verein Atlético Madrid in einem europäischen Wettbewerb.', isMisleading: false },
    { text: 'Dieses Spiel gegen Atlético Madrid endete 2:0, wobei beide Tore erst in den letzten Minuten fielen.', isMisleading: false },
  ],
  answer: {
    canonical: 'Udinese Calcio',
    aliases: [
      'Udine',
      'Udinese',
      'Udinese Calcio',
      'Udinesse',
      'Udineze',
      'Udinese Kaltscho',
    ],
  },
  encouragements: [
    'Knapp daneben – schau dir die Hinweise noch einmal genau an.',
    'Guter Versuch! Vielleicht hat dich der falsche Hinweis erwischt.',
    'Noch nicht ganz. Du bist dem gesuchten Verein bestimmt schon nah.',
    'Weiter geht’s – ein Hinweis will dich absichtlich täuschen!',
  ],
  success: {
    eyebrow: 'Volltreffer!',
    title: 'Richtig geraten, Philipp!',
    message: `Alles Gute zum Geburtstag, Philipp!
Wir wünschen dir einen großartigen Geburtstag, viel Glück, Gesundheit und viele schöne Fußballmomente im neuen Lebensjahr.

Und weil eine richtige Antwort ohne Preis nur halb so spannend wäre:

Dein Preis wartet im Schrank neben dem TV auf dich.`,
  },
}
