import { useMemo, useState } from 'react'
import { students, arcadeLeaderboard } from '../../data/classData.js'

function shuffle(arr) {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function buildQuestion(excludeId) {
  const pool = excludeId ? students.filter((s) => s.id !== excludeId) : students
  const target = pool[Math.floor(Math.random() * pool.length)]
  const distractors = shuffle(students.filter((s) => s.id !== target.id)).slice(0, 3)
  const options = shuffle([target, ...distractors])
  return { target, options }
}

export default function GuessTheClassmate() {
  const [question, setQuestion] = useState(() => buildQuestion())
  const [selectedId, setSelectedId] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [asked, setAsked] = useState(0)

  const isCorrect = (id) => id === question.target.id

  const handleSelect = (id) => {
    if (answered) return
    setSelectedId(id)
    setAnswered(true)
    setAsked((a) => a + 1)
    if (isCorrect(id)) {
      setScore((s) => s + 1)
      setStreak((st) => {
        const next = st + 1
        setBestStreak((b) => Math.max(b, next))
        return next
      })
    } else {
      setStreak(0)
    }
  }

  const nextQuestion = () => {
    setQuestion(buildQuestion(question.target.id))
    setSelectedId(null)
    setAnswered(false)
  }

  const accuracy = asked > 0 ? Math.round((score / asked) * 100) : 0

  const skillsPreview = useMemo(() => question.target.skills.slice(0, 3), [question])

  return (
    <section id="tebak-siapa" className="guess-root border-b-4 border-ink bg-paper px-6 py-16 md:px-12">
      <div className="guess-inner mx-auto max-w-5xl">
        <p className="guess-eyebrow font-mono text-xs uppercase tracking-[0.3em] text-neonrose">
          🕵️ tebak_siapa_aku
        </p>
        <h2 className="guess-title mt-2 font-display text-4xl text-ink">Tebak Siapa Aku</h2>
        <p className="guess-subtitle mt-2 max-w-xl text-sm text-inkline/80">
          Baca petunjuknya, lalu tebak teman sekelas mana yang dimaksud. Seberapa kenal kamu sama
          angkatan sendiri?
        </p>

        <div className="guess-layout mt-8 grid gap-6 lg:grid-cols-[1fr_260px]">
          <div className="guess-crt relative overflow-hidden rounded-xl border-4 border-ink bg-crt p-4 shadow-win95 sm:rounded-[2rem] sm:border-8 sm:p-8">
            <div
              className="guess-scanline pointer-events-none absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg, #34D399 0px, transparent 2px, transparent 4px)',
              }}
            />
            <div className="guess-hud relative z-10 flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-neonemerald sm:text-sm">
              <span>SKOR: {score}/{asked}</span>
              <span>STREAK: {streak} 🔥</span>
              <span>AKURASI: {accuracy}%</span>
            </div>

            <div className="guess-clue-card relative z-10 mt-6 border-2 border-offwhite/20 bg-offwhite/5 p-5">
              <p className="guess-clue-label font-mono text-[10px] uppercase tracking-widest text-offwhite/40">
                Kutipan favoritnya
              </p>
              <blockquote className="guess-clue-quote mt-2 font-display text-2xl leading-snug text-offwhite sm:text-3xl">
                “{question.target.quote}”
              </blockquote>

              <div className="guess-clue-skills mt-4 flex flex-wrap gap-2">
                {skillsPreview.map((skill) => (
                  <span
                    key={skill}
                    className="guess-clue-tag border-2 border-neonviolet/60 bg-neonviolet/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-neonviolet"
                  >
                    {skill}
                  </span>
                ))}
                <span className="guess-clue-tag border-2 border-mustard/60 bg-mustard/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-mustard">
                  {question.target.role}
                </span>
              </div>
            </div>

            <div className="guess-options relative z-10 mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {question.options.map((opt) => {
                const showState = answered
                const correct = showState && isCorrect(opt.id)
                const wrongSelected = showState && selectedId === opt.id && !isCorrect(opt.id)
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect(opt.id)}
                    disabled={answered}
                    className={`guess-option flex items-center gap-3 border-2 p-3 text-left font-mono text-sm transition ${
                      correct
                        ? 'border-neonemerald bg-neonemerald/20 text-neonemerald'
                        : wrongSelected
                        ? 'animate-shake border-neonrose bg-neonrose/20 text-neonrose'
                        : 'border-offwhite/20 bg-offwhite/5 text-offwhite hover:bg-offwhite/10'
                    }`}
                  >
                    <img
                      src={opt.photo}
                      alt={opt.name}
                      className={`guess-option-photo h-9 w-9 flex-shrink-0 rounded-full object-cover transition ${
                        answered ? 'grayscale-0 blur-0' : 'grayscale blur-[2px]'
                      }`}
                    />
                    <span className="guess-option-name truncate">{opt.name}</span>
                  </button>
                )
              })}
            </div>

            {answered && (
              <button
                onClick={nextQuestion}
                className="guess-next-btn relative z-10 mt-5 border-2 border-neonteal bg-neonteal/10 px-5 py-2 font-mono text-xs uppercase tracking-widest text-neonteal transition hover:bg-neonteal hover:text-crt"
              >
                Pertanyaan Berikutnya →
              </button>
            )}
          </div>

          <aside className="guess-leaderboard border-2 border-ink bg-offwhite p-4 shadow-win95">
            <p className="guess-leaderboard-title font-display text-lg text-ink">Rekor Kelas</p>
            <p className="guess-leaderboard-note mt-1 font-mono text-[10px] text-inkline/50">
              Streak terbaikmu sesi ini: <span className="text-neonviolet">{bestStreak}</span>
            </p>
            <ol className="guess-leaderboard-list mt-3 space-y-2">
              {arcadeLeaderboard.map((entry) => (
                <li
                  key={entry.rank}
                  className="guess-leaderboard-item flex items-center justify-between border-b border-ink/10 pb-1 font-mono text-xs text-inkline"
                >
                  <span>
                    #{entry.rank} {entry.name}
                  </span>
                  <span className="text-neonviolet">{entry.score}</span>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </div>
    </section>
  )
}
