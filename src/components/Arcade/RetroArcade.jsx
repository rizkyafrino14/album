import { useEffect, useRef, useState } from 'react'
import { arcadeLeaderboard, arcadeTargets } from '../../data/classData.js'

const GAME_DURATION = 20

export default function RetroArcade() {
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const [isRunning, setIsRunning] = useState(false)
  const [target, setTarget] = useState({ text: arcadeTargets[0], top: 50, left: 50 })
  const timerRef = useRef(null)

  const spawnTarget = () => {
    const text = arcadeTargets[Math.floor(Math.random() * arcadeTargets.length)]
    const top = Math.random() * 70 + 10
    const left = Math.random() * 75 + 5
    setTarget({ text, top, left })
  }

  const startGame = () => {
    setScore(0)
    setTimeLeft(GAME_DURATION)
    setIsRunning(true)
    spawnTarget()
  }

  useEffect(() => {
    if (!isRunning) return
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          setIsRunning(false)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [isRunning])

  const handleHit = () => {
    if (!isRunning) return
    setScore((s) => s + 10)
    spawnTarget()
  }

  return (
    <section id="arcade" className="arcade-root border-b-4 border-ink bg-paper px-6 py-16 md:px-12">
      <div className="arcade-inner mx-auto max-w-5xl">
        <p className="arcade-eyebrow font-mono text-xs uppercase tracking-[0.3em] text-neonrose">
          👾 x_rpl_arcade
        </p>
        <h2 className="arcade-title mt-2 font-display text-4xl text-ink">Buru Bug Sebelum Deadline</h2>
        <p className="arcade-subtitle mt-2 max-w-xl text-sm text-inkline/80">
          Klik teks error yang muncul acak secepat mungkin dalam {GAME_DURATION} detik.
        </p>

        <div className="arcade-layout mt-8 grid gap-6 lg:grid-cols-[1fr_260px]">
          <div className="arcade-crt relative h-80 overflow-hidden rounded-[2rem] border-8 border-ink bg-crt shadow-win95 sm:h-96">
            <div
              className="arcade-scanline pointer-events-none absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg, #34D399 0px, transparent 2px, transparent 4px)',
              }}
            />
            <div className="arcade-vignette pointer-events-none absolute inset-0 shadow-[inset_0_0_80px_30px_rgba(0,0,0,0.7)]" />

            <div className="arcade-hud absolute left-4 top-4 z-10 font-mono text-xs text-neonemerald sm:text-sm">
              SKOR: {score.toString().padStart(4, '0')}
            </div>
            <div className="arcade-hud absolute right-4 top-4 z-10 font-mono text-xs text-neonrose sm:text-sm">
              WAKTU: {timeLeft}s
            </div>

            {isRunning && (
              <button
                onClick={handleHit}
                style={{ top: `${target.top}%`, left: `${target.left}%` }}
                className="arcade-target absolute z-10 -translate-x-1/2 -translate-y-1/2 border-2 border-neonrose bg-black/60 px-3 py-1 font-pixel text-[10px] text-neonrose shadow-neonviolet transition hover:scale-110 sm:text-xs"
              >
                {target.text}
              </button>
            )}

            {!isRunning && (
              <div className="arcade-overlay absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-black/70 text-center">
                <p className="arcade-overlay-title font-pixel text-xs text-offwhite sm:text-sm">
                  {timeLeft === 0 ? 'GAME OVER' : 'X RPL ARCADE'}
                </p>
                {timeLeft === 0 && (
                  <p className="arcade-overlay-score font-mono text-neonemerald">
                    Skor akhir: {score}
                  </p>
                )}
                <button
                  onClick={startGame}
                  className="arcade-start-btn border-2 border-neonemerald bg-neonemerald/10 px-4 py-2 font-mono text-xs uppercase tracking-widest text-neonemerald hover:bg-neonemerald hover:text-crt"
                >
                  {timeLeft === 0 && !isRunning && score === 0 ? 'Mulai' : 'Main Lagi'}
                </button>
              </div>
            )}
          </div>

          <aside className="arcade-leaderboard border-2 border-ink bg-offwhite p-4 shadow-win95">
            <p className="arcade-leaderboard-title font-display text-lg text-ink">Papan Skor</p>
            <ol className="arcade-leaderboard-list mt-3 space-y-2">
              {arcadeLeaderboard.map((entry) => (
                <li
                  key={entry.rank}
                  className="arcade-leaderboard-item flex items-center justify-between border-b border-ink/10 pb-1 font-mono text-xs text-inkline"
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
