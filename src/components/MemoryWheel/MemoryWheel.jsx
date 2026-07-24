import { useMemo, useRef, useState } from 'react'
import { memoryContributions } from '../../data/classData.js'

const SLICE_COUNT = 10
const sliceColors = ['#E3B23C', '#2DD4BF', '#A78BFA', '#F2E8CF']
const HISTORY_LIMIT = 4

function describeWedge(index, total, radius = 140, center = 150) {
  const angle = 360 / total
  const startAngle = index * angle
  const endAngle = startAngle + angle
  const toRad = (deg) => ((deg - 90) * Math.PI) / 180
  const x1 = center + radius * Math.cos(toRad(startAngle))
  const y1 = center + radius * Math.sin(toRad(startAngle))
  const x2 = center + radius * Math.cos(toRad(endAngle))
  const y2 = center + radius * Math.sin(toRad(endAngle))
  const largeArc = angle > 180 ? 1 : 0
  return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`
}

function cleanMessage(message) {
  return message.replace(/^Commit\s*\d{1,2}\s*\w{3}:\s*/, '')
}

const sparklePositions = [
  { top: '5%', left: '15%' },
  { top: '0%', left: '50%' },
  { top: '10%', left: '82%' },
  { top: '50%', left: '95%' },
  { top: '85%', left: '80%' },
  { top: '92%', left: '45%' },
  { top: '80%', left: '10%' },
  { top: '45%', left: '2%' },
]

export default function MemoryWheel() {
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState([])
  const [hovering, setHovering] = useState(false)
  const spinCountRef = useRef(0)
  const usedIndicesRef = useRef([])

  const slices = useMemo(() => Array.from({ length: SLICE_COUNT }, (_, i) => i), [])

  const pickTargetIndex = () => {
    // Hindari mengulang slice yang sama sampai semua slice sudah pernah muncul.
    if (usedIndicesRef.current.length >= SLICE_COUNT) {
      usedIndicesRef.current = []
    }
    let idx
    do {
      idx = Math.floor(Math.random() * SLICE_COUNT)
    } while (usedIndicesRef.current.includes(idx))
    usedIndicesRef.current.push(idx)
    return idx
  }

  const handleSpin = () => {
    if (spinning) return
    setSpinning(true)
    setResult(null)

    const targetIndex = pickTargetIndex()
    const sliceAngle = 360 / SLICE_COUNT
    spinCountRef.current += 1
    const fullSpins = 6 * 360
    const landingOffset = targetIndex * sliceAngle + sliceAngle / 2
    const newRotation =
      rotation - (rotation % 360) + fullSpins - landingOffset + 360 * spinCountRef.current

    setRotation(newRotation)

    const entry = memoryContributions[targetIndex % memoryContributions.length]
    window.clearTimeout(handleSpin._t)
    handleSpin._t = window.setTimeout(() => {
      setSpinning(false)
      setResult(entry)
      setHistory((prev) => {
        const next = [entry, ...prev.filter((e) => e.message !== entry.message)]
        return next.slice(0, HISTORY_LIMIT)
      })
    }, 4200)
  }

  return (
    <section id="roda-kenangan" className="wheel-root relative overflow-hidden border-b-4 border-ink bg-crt px-6 py-16 md:px-12">
      <div
        className="wheel-bg-glow pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #A78BFA 0%, transparent 70%)' }}
      />

      <div className="wheel-inner relative mx-auto max-w-4xl">
        <p className="wheel-eyebrow font-mono text-xs uppercase tracking-[0.3em] text-neonviolet">
          🎡 roda_kenangan
        </p>
        <h2 className="wheel-title mt-2 font-display text-4xl text-offwhite">Roda Kenangan Kelas</h2>
        <p className="wheel-subtitle mt-2 max-w-xl text-sm text-offwhite/60">
          Putar rodanya dan biarkan takdir memilihkan satu kenangan acak dari perjalanan kelas X RPL.
        </p>

        <div className="wheel-layout mt-10 grid gap-10 md:grid-cols-[auto_1fr] md:items-center">
          <div
            className="wheel-wrap relative mx-auto h-[280px] w-[280px] sm:h-[320px] sm:w-[320px]"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            <div
              className={`wheel-glow-ring pointer-events-none absolute inset-[-10px] rounded-full transition-opacity duration-500 ${
                spinning ? 'opacity-100' : hovering ? 'opacity-70' : 'opacity-30'
              }`}
              style={{
                background: 'conic-gradient(from 0deg, #2DD4BF, #A78BFA, #E3B23C, #2DD4BF)',
                filter: 'blur(10px)',
              }}
            />

            <div className="wheel-pointer absolute left-1/2 top-[-14px] z-20 -translate-x-1/2">
              <div
                className={`wheel-pointer-shape h-0 w-0 border-x-[14px] border-t-[22px] border-x-transparent border-t-mustard drop-shadow-md transition-transform ${
                  spinning ? 'animate-[shake_0.3s_ease-in-out_infinite]' : ''
                }`}
              />
            </div>

            <svg
              viewBox="0 0 300 300"
              className={`wheel-svg relative h-full w-full drop-shadow-2xl transition-transform duration-300 ${
                !spinning && hovering ? 'scale-105' : ''
              }`}
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: spinning
                  ? 'transform 4.2s cubic-bezier(0.15, 0.85, 0.25, 1)'
                  : 'transform 0.3s ease-out',
              }}
            >
              <circle cx="150" cy="150" r="146" fill="#211F1B" />
              {slices.map((i) => (
                <path
                  key={i}
                  d={describeWedge(i, SLICE_COUNT)}
                  fill={sliceColors[i % sliceColors.length]}
                  stroke="#211F1B"
                  strokeWidth="2"
                />
              ))}
              <circle cx="150" cy="150" r="26" fill="#211F1B" stroke="#2DD4BF" strokeWidth="3" />
            </svg>

            <div className="wheel-hub-label pointer-events-none absolute inset-0 flex items-center justify-center">
              <span
                className={`wheel-hub-icon font-display text-2xl text-neonteal transition-transform ${
                  spinning ? 'animate-spinTape' : ''
                }`}
              >
                {spinning ? '◌' : '?'}
              </span>
            </div>
          </div>

          <div className="wheel-result-area">
            <button
              onClick={handleSpin}
              disabled={spinning}
              className="wheel-spin-btn border-2 border-neonteal bg-neonteal/10 px-6 py-3 font-mono text-xs uppercase tracking-widest text-neonteal transition hover:-translate-y-0.5 hover:bg-neonteal hover:text-crt disabled:cursor-not-allowed disabled:opacity-50"
            >
              {spinning ? 'Memutar roda...' : history.length ? 'Putar Lagi →' : 'Putar Roda →'}
            </button>

            <div
              key={result?.message || 'empty'}
              className={`wheel-result relative min-h-[120px] overflow-hidden border-2 border-offwhite/20 bg-offwhite/5 p-5 transition-all duration-500 ${
                result ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-60'
              } mt-6`}
            >
              {result && (
                <div className="wheel-sparkles pointer-events-none absolute inset-0">
                  {sparklePositions.map((pos, i) => (
                    <span
                      key={i}
                      style={{ top: pos.top, left: pos.left, animationDelay: `${i * 40}ms` }}
                      className="wheel-sparkle absolute h-1.5 w-1.5 animate-sparkle rounded-full bg-neonteal"
                    />
                  ))}
                </div>
              )}

              {result ? (
                <p className="wheel-result-message relative text-sm leading-relaxed text-offwhite/90">
                  {cleanMessage(result.message)}
                </p>
              ) : (
                <p className="wheel-result-placeholder relative font-mono text-sm text-offwhite/40">
                  Kenangan yang terpilih akan muncul di sini setelah roda berhenti berputar.
                </p>
              )}
            </div>

            {history.length > 0 && (
              <div className="wheel-history mt-6">
                <p className="wheel-history-label font-mono text-[10px] uppercase tracking-widest text-offwhite/40">
                  Kenangan yang sudah terkumpul
                </p>
                <div className="wheel-history-grid mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {history.map((entry, idx) => {
                    const tilt = [-3, 2, -1.5, 3][idx % 4]
                    const isLatest = idx === 0
                    return (
                      <div
                        key={entry.message}
                        style={{ transform: `rotate(${tilt}deg)` }}
                        className={`wheel-history-card group relative border-2 bg-offwhite p-2.5 shadow-win95sm transition-transform duration-300 hover:rotate-0 hover:scale-105 ${
                          isLatest ? 'border-neonteal' : 'border-ink/70'
                        }`}
                      >
                        {isLatest && (
                          <span className="wheel-history-badge absolute -top-2 left-1/2 -translate-x-1/2 border border-ink bg-neonteal px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-widest text-crt shadow-win95sm">
                            baru
                          </span>
                        )}
                        <p className="wheel-history-icon text-center text-lg">💾</p>
                        <div className="wheel-history-divider my-1.5 border-t border-dashed border-ink/30" />
                        <p className="wheel-history-message line-clamp-4 text-center font-mono text-[9px] leading-snug text-ink/80">
                          {cleanMessage(entry.message)}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
