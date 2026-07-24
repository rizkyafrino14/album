import { useState } from 'react'
import { labSeatMap } from '../../data/classData.js'

export default function LabSeatMap() {
  const [activeSeat, setActiveSeat] = useState(null)

  const rows = Math.max(...labSeatMap.map((s) => s.row)) + 1
  const cols = Math.max(...labSeatMap.map((s) => s.col)) + 1

  const seatAt = (row, col) => labSeatMap.find((s) => s.row === row && s.col === col)

  return (
    <section id="peta" className="seatmap-root relative border-b-4 border-ink bg-offwhite px-4 py-16 sm:px-6 md:px-12">
      <div className="seatmap-inner mx-auto max-w-4xl">
        <p className="seatmap-eyebrow font-mono text-xs uppercase tracking-[0.3em] text-neonteal">
          🗺️ lab_rpl_seat_map
        </p>
        <h2 className="seatmap-title mt-2 font-display text-4xl text-ink">Peta Tempat Duduk Lab</h2>
        <p className="seatmap-subtitle mt-2 max-w-xl text-sm text-inkline/80">
          Klik salah satu komputer untuk lihat siapa yang biasa duduk di sana.
        </p>

        <div className="seatmap-board mt-8 overflow-x-auto border-2 border-ink bg-paper p-3 shadow-win95 sm:p-6">
          <div className="seatmap-front mb-4 min-w-[280px] border-2 border-dashed border-ink/40 py-2 text-center font-mono text-[10px] uppercase tracking-widest text-ink/50">
            papan tulis / depan kelas
          </div>

          <div
            className="seatmap-grid grid min-w-[280px] gap-1.5 sm:gap-3"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(56px, 1fr))` }}
          >
            {Array.from({ length: rows }).map((_, row) =>
              Array.from({ length: cols }).map((_, col) => {
                const seat = seatAt(row, col)
                if (!seat) return <div key={`${row}-${col}`} />
                const isEmpty = !seat.occupant
                return (
                  <button
                    key={seat.id}
                    onClick={() => setActiveSeat(seat)}
                    className={`seatmap-pc group relative flex flex-col items-center gap-1 border-2 p-1.5 font-mono text-[8px] shadow-win95sm transition hover:-translate-y-0.5 sm:p-2 sm:text-[10px] ${
                      isEmpty
                        ? 'border-ink/30 bg-offwhite/60 text-ink/40'
                        : 'border-ink bg-offwhite text-ink hover:bg-neonteal/20'
                    }`}
                  >
                    <span className="seatmap-pc-icon text-base sm:text-xl" aria-hidden="true">
                      🖥️
                    </span>
                    <span className="seatmap-pc-label w-full truncate text-center">
                      {isEmpty ? 'kosong' : seat.occupant.split(' ')[0]}
                    </span>
                  </button>
                )
              })
            )}
          </div>
        </div>
      </div>

      {activeSeat && (
        <div
          className="seatmap-overlay fixed inset-0 z-[100] flex items-center justify-center bg-ink/70 p-4"
          onClick={() => setActiveSeat(null)}
        >
          <div
            className="seatmap-popup w-full max-w-sm border-4 border-ink bg-offwhite shadow-win95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="seatmap-popup-header flex items-center justify-between border-b-4 border-ink bg-neonteal/40 px-4 py-2">
              <p className="seatmap-popup-title font-display text-lg text-ink">{activeSeat.id.toUpperCase()}</p>
              <button
                onClick={() => setActiveSeat(null)}
                className="seatmap-popup-close border-2 border-ink bg-offwhite px-2 py-0.5 font-mono text-xs shadow-win95sm hover:bg-neonrose"
              >
                X
              </button>
            </div>
            <div className="seatmap-popup-body p-4">
              <p className="seatmap-popup-occupant font-display text-2xl text-ink">
                {activeSeat.occupant || 'Kursi Kosong'}
              </p>
              <p className="seatmap-popup-habit mt-2 text-sm leading-relaxed text-inkline/80">
                {activeSeat.habit}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
