import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { quizConfig } from './config'
import { isAcceptedAnswer } from './lib/answerMatcher'
import { validateQuizConfig } from './lib/validateConfig'

type QuizScreen = 'welcome' | 'quiz' | 'success'

const BallMark = () => (
  <span className="ball-mark" aria-hidden="true">
    <span>◆</span>
  </span>
)

const Confetti = () => (
  <div className="confetti" aria-hidden="true">
    {Array.from({ length: 26 }, (_, index) => (
      <i
        key={index}
        style={{
          '--x': `${(index * 37) % 100}%`,
          '--delay': `${(index % 9) * 0.13}s`,
          '--duration': `${2.6 + (index % 5) * 0.28}s`,
          '--rotate': `${(index * 47) % 360}deg`,
        } as React.CSSProperties}
      />
    ))}
  </div>
)

const RichMessage = ({ text }: { text: string }) => (
  <div className="success-message">
    {text.split('\n').map((line, lineIndex) => {
      if (!line) return <span className="message-gap" key={`gap-${lineIndex}`} aria-hidden="true" />

      const parts = line.split(/(\*\*.*?\*\*)/g).filter(Boolean)
      return (
        <p key={`${lineIndex}-${line}`}>
          {parts.map((part, partIndex) => part.startsWith('**') && part.endsWith('**')
            ? <strong key={partIndex}>{part.slice(2, -2)}</strong>
            : part)}
        </p>
      )
    })}
  </div>
)

function QuizExperience() {
  const [screen, setScreen] = useState<QuizScreen>('welcome')
  const [guess, setGuess] = useState('')
  const [feedback, setFeedback] = useState('')
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const feedbackIndex = useRef(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const speechConstructor = typeof window !== 'undefined'
    ? window.SpeechRecognition ?? window.webkitSpeechRecognition
    : undefined
  const trueClueCount = quizConfig.clues.filter((clue) => !clue.isMisleading).length
  const hasPlaceholderContent = quizConfig.clues.some((clue) => clue.text.includes('PLATZHALTER'))
    || quizConfig.success.message.includes('PLATZHALTER')

  useEffect(() => () => recognitionRef.current?.stop(), [])

  const checkGuess = (rawGuess: string) => {
    const trimmed = rawGuess.trim()
    if (!trimmed) {
      setFeedback('Sag oder tippe zuerst einen Vereinsnamen.')
      inputRef.current?.focus()
      return
    }

    if (isAcceptedAnswer(trimmed, quizConfig.answer.aliases)) {
      setFeedback('')
      setScreen('success')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const messages = quizConfig.encouragements
    setFeedback(messages[feedbackIndex.current % messages.length])
    feedbackIndex.current += 1
    setGuess('')
    window.setTimeout(() => inputRef.current?.focus(), 0)
  }

  const submitGuess = (event: FormEvent) => {
    event.preventDefault()
    checkGuess(guess)
  }

  const listen = () => {
    if (!speechConstructor || isListening) return
    const recognition = new speechConstructor()
    recognition.lang = 'de-DE'
    recognition.interimResults = false
    recognition.continuous = false
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? ''
      setGuess(transcript)
      setFeedback(`Verstanden: „${transcript}“`)
      window.setTimeout(() => checkGuess(transcript), 450)
    }
    recognition.onerror = (event) => {
      const denied = event.error === 'not-allowed' || event.error === 'service-not-allowed'
      setFeedback(denied
        ? 'Das Mikrofon ist nicht freigegeben. Tippen funktioniert weiterhin.'
        : 'Das konnte ich leider nicht verstehen. Versuch es noch einmal oder tippe die Antwort.')
    }
    recognition.onend = () => setIsListening(false)
    recognitionRef.current = recognition
    setFeedback('Ich höre zu …')
    setIsListening(true)
    recognition.start()
  }

  if (screen === 'welcome') {
    return (
      <main className="page centered-page">
        <section className="hero-card welcome-card" aria-labelledby="welcome-title">
          <div className="number-badge" aria-label={`${quizConfig.player.age}. Geburtstag`}>
            <span>{quizConfig.player.age}</span>
          </div>
          <p className="eyebrow">{quizConfig.intro.eyebrow}</p>
          <h1 id="welcome-title">Hallo {quizConfig.player.name}!</h1>
          <h2>{quizConfig.intro.title}</h2>
          <p className="lead">{quizConfig.intro.text}</p>
          <button className="primary-button" onClick={() => setScreen('quiz')}>
            Quiz starten <span aria-hidden="true">→</span>
          </button>
          <div className="mini-pitch" aria-hidden="true"><BallMark /></div>
        </section>
      </main>
    )
  }

  if (screen === 'success') {
    return (
      <main className="page centered-page success-page">
        <Confetti />
        <section className="hero-card success-card" aria-labelledby="success-title">
          <div className="success-icon" aria-hidden="true">✓</div>
          <p className="eyebrow">{quizConfig.success.eyebrow}</p>
          <h1 id="success-title">{quizConfig.success.title}</h1>
          <p className="club-reveal">{quizConfig.answer.canonical}</p>
          <RichMessage text={quizConfig.success.message} />
          <button className="secondary-button" onClick={() => {
            setScreen('welcome')
            setGuess('')
            setFeedback('')
          }}>
            Noch einmal spielen
          </button>
        </section>
      </main>
    )
  }

  return (
    <main className="page quiz-page">
      <header className="quiz-header">
        <div className="brand"><BallMark /><span>Philipps Fußball-Quiz</span></div>
        <span className="age-pill">Level {quizConfig.player.age}</span>
      </header>

      <section className="quiz-intro" aria-labelledby="quiz-title">
        <h1 id="quiz-title">Welchen Verein suchen wir?</h1>
        <p>{trueClueCount} Hinweise stimmen. Einer will dich auf die falsche Fährte locken.</p>
      </section>

      {hasPlaceholderContent && (
        <aside className="placeholder-notice" role="note">
          <strong>Inhalte in Vorbereitung</strong>
          <span>Diese Hinweistexte sind Platzhalter und werden vor dem Geburtstag ersetzt.</span>
        </aside>
      )}

      <ol className="clue-grid" aria-label="Hinweise zum gesuchten Verein">
        {quizConfig.clues.map((clue, index) => (
          <li className="clue-card" key={`${index}-${clue.text}`}>
            <span className="clue-number">{String(index + 1).padStart(2, '0')}</span>
            <p>{clue.text}</p>
          </li>
        ))}
      </ol>

      <section className="answer-panel" aria-labelledby="answer-title">
        <div>
          <p className="eyebrow">Dein Tipp</p>
          <h2 id="answer-title">Sag oder tippe den Verein</h2>
        </div>
        <form onSubmit={submitGuess} className="answer-form">
          <label className="sr-only" htmlFor="club-answer">Name des Fußballvereins</label>
          <div className="input-row">
            <input
              ref={inputRef}
              id="club-answer"
              value={guess}
              onChange={(event) => setGuess(event.target.value)}
              placeholder="Vereinsname …"
              autoComplete="off"
              enterKeyHint="done"
            />
            {speechConstructor && (
              <button
                type="button"
                className={`mic-button ${isListening ? 'listening' : ''}`}
                aria-label={isListening ? 'Mikrofon hört zu' : 'Antwort sprechen'}
                aria-pressed={isListening}
                onClick={listen}
                disabled={isListening}
              >
                <span aria-hidden="true">{isListening ? '●' : '🎙'}</span>
              </button>
            )}
          </div>
          <button className="primary-button submit-button" type="submit">Antwort prüfen</button>
        </form>
        <p className="feedback" role="status" aria-live="polite">{feedback}</p>
      </section>
    </main>
  )
}

function QrUtility() {
  const defaultUrl = useMemo(() => window.location.href.replace(/#\/qr.*$/, ''), [])
  const [url, setUrl] = useState(defaultUrl)
  const [qrData, setQrData] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      try {
        const parsed = new URL(url)
        if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('invalid')
        const data = await QRCode.toDataURL(url, {
          width: 640,
          margin: 3,
          errorCorrectionLevel: 'H',
          color: { dark: '#171717', light: '#ffffff' },
        })
        setQrData(data)
        setError('')
      } catch {
        setQrData('')
        setError('Bitte gib eine vollständige Webadresse mit https:// ein.')
      }
    }, 180)
    return () => window.clearTimeout(timer)
  }, [url])

  return (
    <main className="page centered-page qr-page">
      <section className="hero-card qr-card" aria-labelledby="qr-title">
        <a className="back-link" href="#">← Zurück zum Quiz</a>
        <p className="eyebrow">Werkzeug</p>
        <h1 id="qr-title">QR-Code erstellen</h1>
        <p className="lead">Füge die veröffentlichte Quiz-Adresse ein. Der Code wird nur in deinem Browser erzeugt.</p>
        <label className="url-label" htmlFor="quiz-url">Quiz-Adresse</label>
        <input
          id="quiz-url"
          className="url-input"
          type="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          spellCheck="false"
        />
        {error && <p className="form-error" role="alert">{error}</p>}
        {qrData && (
          <div className="qr-output">
            <img src={qrData} alt="QR-Code für die eingegebene Quiz-Adresse" />
            <a className="primary-button download-link" href={qrData} download="philipp-fussballquiz-qr.png">
              QR-Code herunterladen
            </a>
          </div>
        )}
      </section>
    </main>
  )
}

export default function App() {
  const [route, setRoute] = useState(window.location.hash)

  validateQuizConfig(quizConfig)

  useEffect(() => {
    const updateRoute = () => setRoute(window.location.hash)
    window.addEventListener('hashchange', updateRoute)
    return () => window.removeEventListener('hashchange', updateRoute)
  }, [])

  return route.startsWith('#/qr') ? <QrUtility /> : <QuizExperience />
}
