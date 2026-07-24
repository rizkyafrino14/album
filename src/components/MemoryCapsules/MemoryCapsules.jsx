import { useMemo, useState } from 'react'
import { memoryContributions } from '../../data/classData.js'

const capsuleIcons = ['💾', '📼', '🕹️', '💿', '📀', '🖴']

function cleanMessage(message) {
  return message.replace(/^Commit\s*\d{1,2}\s*\w{3}:\s*/, '')
}

function shuffleIndices(length) {
  const arr = Array.from({ length }, (_, i) => i)
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export default function MemoryCapsules() {
  const [order, setOrder] = useState(() => shuffleIndices(memoryContributions.length))
  const [openedIds, setOpenedIds] = useState(() => new Set())

  const total = memoryContributions.length
  const openedCount = openedIds.size
  const progressPct = Math.round((openedCount / total) * 100)

  const allOpened = openedCount === total

  const openCapsule = (idx) => {
    if (openedIds.has(idx)) return
    setOpenedIds((prev) => new Set(prev).add(idx))
  }

  const openAll = () => {
    setOpenedIds(new Set(order))
  }

  const resetAll = () => {
    setOpenedIds(new Set())
    setOrder(shuffleIndices(total))
  }

  const cards = useMemo(() => order, [order])

  return (
    <section
      id="kapsul-kenangan"
      className="capsules-root relative overflow-hidden border-b-4 border-ink bg-crt px-6 py-16 md:px-12"
    >
      <div
        className="capsules-bg-glow pointer-events-none absolute left-1/2 top-1/4 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #A78BFA 0%, transparent 70%)' }}
      />

      <div className="capsules-inner relative mx-auto max-w-5xl">
        <p className="capsules-eyebrow font-mono text-xs uppercase tracking-[0.3em] text-neonviolet">
          🧠 kapsul_kenangan
        </p>
        <h2 className="capsules-title mt-2 font-display text-4xl text-offwhite">Kapsul Kenangan</h2>
        <p className="capsules-subtitle mt-2 max-w-xl text-sm text-offwhite/60">
          18 kapsul kenangan tersembunyi di bawah ini. Klik satu-satu untuk membukanya dan kumpulkan
          semua ceritanya.
        </p>

        <div className="capsules-progress mt-6 flex flex-wrap items-center gap-3">
          <div className="capsules-progress-track h-3 w-48 border-2 border-offwhite/30 bg-offwhite/5 sm:w-64">
            <div
              className="capsules-progress-fill h-full bg-neonteal transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="capsules-progress-label font-mono text-xs text-offwhite/70">
            {openedCount}/{total} kenangan terbuka
          </p>

          <div className="capsules-actions ml-auto flex gap-2">
            {!allOpened && (
              <button
                onClick={openAll}
                className="capsules-open-all border-2 border-neonemerald bg-neonemerald/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-neonemerald transition hover:bg-neonemerald hover:text-crt"
              >
                Buka Semua
              </button>
            )}
            <button
              onClick={resetAll}
              className="capsules-reset border-2 border-offwhite/40 bg-offwhite/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-offwhite/70 transition hover:bg-offwhite/10"
            >
              🔀 Acak &amp; Tutup Semua
            </button>
          </div>
        </div>

        <div className="capsules-grid mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {cards.map((idx, gridPos) => {
            const entry = memoryContributions[idx]
            const isOpen = openedIds.has(idx)
            const icon = capsuleIcons[gridPos % capsuleIcons.length]
            return (
              <button
                key={entry.date}
                onClick={() => openCapsule(idx)}
                aria-label={isOpen ? cleanMessage(entry.message) : 'Buka kapsul kenangan'}
                className="capsules-card-wrap relative h-40"
                style={{ perspective: '1000px' }}
              >
                <div
                  className="capsules-card-inner relative h-full w-full transition-transform duration-500"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: isOpen ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                >
                  {/* Sisi depan — tertutup */}
                  <div
                    className="capsules-card-front absolute inset-0 flex flex-col items-center justify-center gap-2 border-2 border-offwhite/30 bg-gradient-to-br from-neonviolet/30 via-crt to-neonteal/20 shadow-win95sm"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <span className="capsules-card-icon text-3xl">{icon}</span>
                    <span className="capsules-card-hint font-mono text-[9px] uppercase tracking-widest text-offwhite/50">
                      Kapsul #{gridPos + 1}
                    </span>
                    <span className="capsules-card-cta font-mono text-[9px] text-neonteal">
                      klik untuk buka
                    </span>
                  </div>

                  {/* Sisi belakang — terbuka, isi kenangan */}
                  <div
                    className="capsules-card-back absolute inset-0 flex flex-col items-center justify-center gap-1.5 overflow-hidden border-2 border-neonteal bg-offwhite p-3 shadow-win95sm"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                  >
                    <span className="capsules-card-back-icon text-lg">✓</span>
                    <p className="capsules-card-message line-clamp-4 text-center font-mono text-[10px] leading-snug text-ink/85">
                      {cleanMessage(entry.message)}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {allOpened && (
          <p className="capsules-complete mt-6 text-center font-mono text-xs uppercase tracking-widest text-neonemerald">
            🎉 Semua kenangan sudah terbuka — koleksimu lengkap!
          </p>
        )}
      </div>
    </section>
  )
}
