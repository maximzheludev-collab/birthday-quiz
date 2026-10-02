const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ß/g, 'ss')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')

const levenshtein = (left: string, right: string) => {
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index)

  for (let i = 1; i <= left.length; i += 1) {
    let diagonal = previous[0]
    previous[0] = i

    for (let j = 1; j <= right.length; j += 1) {
      const above = previous[j]
      previous[j] = Math.min(
        previous[j] + 1,
        previous[j - 1] + 1,
        diagonal + (left[i - 1] === right[j - 1] ? 0 : 1),
      )
      diagonal = above
    }
  }

  return previous[right.length]
}

export const isAcceptedAnswer = (guess: string, aliases: string[]) => {
  const normalizedGuess = normalize(guess)
  if (!normalizedGuess) return false

  return aliases.some((alias) => {
    const normalizedAlias = normalize(alias)
    if (normalizedGuess === normalizedAlias) return true

    const guessWords = ` ${normalizedGuess} `
    if (guessWords.includes(` ${normalizedAlias} `)) return true

    const maxDistance = normalizedAlias.length >= 7 ? 2 : 1
    return levenshtein(normalizedGuess, normalizedAlias) <= maxDistance
  })
}

export { normalize, levenshtein }
