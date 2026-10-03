import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'
import { quizConfig } from './config'

describe('birthday quiz flow', () => {
  it('moves from welcome to the clue board', async () => {
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Hallo Philipp!' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Quiz starten/ }))

    expect(screen.getByRole('heading', { name: 'Welchen Verein suchen wir?' })).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(quizConfig.clues.length)
  })

  it('encourages a wrong answer and allows a retry', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /Quiz starten/ }))

    const input = screen.getByLabelText('Name des Fußballvereins')
    await user.type(input, 'Juventus')
    await user.click(screen.getByRole('button', { name: 'Antwort prüfen' }))

    expect(screen.getByRole('status')).toHaveTextContent(/Knapp daneben/)
    expect(input).toHaveValue('')
    expect(screen.getByRole('heading', { name: 'Welchen Verein suchen wir?' })).toBeInTheDocument()
  })

  it('opens the celebration for an accepted answer', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /Quiz starten/ }))
    await user.type(screen.getByLabelText('Name des Fußballvereins'), 'udinesse')
    await user.click(screen.getByRole('button', { name: 'Antwort prüfen' }))

    expect(screen.getByRole('heading', { name: 'Richtig geraten, Philipp!' })).toBeInTheDocument()
    expect(screen.getByText('Udinese Calcio')).toBeInTheDocument()
    expect(screen.getByText('🎁 Was glaubst du, wartet auf dich?')).toBeInTheDocument()
    expect(screen.getByText('Die Auflösung findest du im Schrank neben dem TV.')).toBeInTheDocument()
  })
})
