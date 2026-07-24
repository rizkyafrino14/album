import { useRef, useState } from 'react'
import { timelineMoments } from '../../data/classData.js'
import Reveal from '../Layout/Reveal.jsx'

export default function MemoryTimeline() {
  const trackRef = useRef(null)
  const [activeMoment, setActiveMoment] = useState(null)

  const scrollByCards = (dir) => {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: dir * 300, behavior: 'smooth' })
  }

  return (
    <section
      id="linimasa"
      className="timeline-root relative overflow-hidden border-b-4 border-ink bg-offwhite px-6 py-16 md:px-12"
    >
      <div
        className="timeline-bg-dots pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(33,31,27,0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      <div className="timeline-inner relative mx-auto max-w-6xl">
        <div className="timeline-header flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="timeline-eyebrow font-mono text-xs uppercase tracking-[0.3em] text-neonteal">
              mesin_waktu_momen
            </p>
            <h2 className="timeline-title mt-2 font-display text-4xl text-ink">Linimasa Kenangan</h2>
            <p className="timeline-subtitle mt-2 max-w-xl text-sm text-inkline/80">
              Perjalanan satu tahun kelas X RPL, dari hari pertama sampai rilis pertama. Geser ke
              samping atau klik tiap etape untuk baca ceritanya.
            </p>
          </div>

          <div className="timeline-nav hidden gap-2 sm:flex">
            <button
              onClick={() => scrollByCards(-1)}
              aria-label="Geser ke kiri"
              className="timeline-nav-btn border-2 border-ink bg-offwhite px-3 py-2 font-mono text-sm shadow-win95sm transition hover:bg-mustard"
            >
              ←
            </button>
            <button
              onClick={() => scrollByCards(1)}
              aria-label="Geser ke kanan"
              className="timeline-nav-btn border-2 border-ink bg-offwhite px-3 py-2 font-mono text-sm shadow-win95sm transition hover:bg-mustard"
            >
              →
            </button>
          </div>
        </div>

        {/* Jalur etape / "peta level" — scroll horizontal dengan garis penghubung putus-putus */}
        <div className="timeline-track-wrap relative mt-12">
          <div className="timeline-track-line pointer-events-none absolute left-0 right-0 top-[38px] hidden border-t-4 border-dashed border-ink/25 sm:block" />

          <div
            ref={trackRef}
            className="timeline-track flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6 pt-2"
          >
            {timelineMoments.map((moment, idx) => (
              <Reveal key={moment.id} direction="up" delay={idx * 60} className="timeline-reveal-item flex-shrink-0">
                <div className="timeline-stage group relative w-64 flex-shrink-0 snap-start sm:w-72">
                  {/* Nomor etape di atas garis */}
                  <div className="timeline-stage-number relative z-10 mx-auto flex h-10 w-10 items-center justify-center border-2 border-ink bg-neonteal font-display text-lg text-ink shadow-win95sm">
                    {String(idx + 1).padStart(2, '0')}
                  </div>

                  <div className="timeline-stage-card relative z-0 mt-3 flex w-full flex-col border-2 border-ink bg-paper p-3 shadow-win95 transition hover:-translate-y-1 hover:shadow-neonviolet">
                    <button
                      onClick={() => setActiveMoment(moment)}
                      className="timeline-stage-open flex w-full flex-col text-left"
                    >
                      <div className="timeline-stage-photo overflow-hidden border-2 border-ink/70">
                        <img
                          src={moment.photo}
                          alt={moment.title}
                          className="timeline-stage-img h-32 w-full object-cover sepia-[.2] contrast-105 transition group-hover:scale-105"
                        />
                      </div>
                      <p className="timeline-stage-date mt-2 font-mono text-[10px] uppercase tracking-widest text-neonviolet">
                        {moment.date}
                      </p>
                      <p className="timeline-stage-title mt-1 font-display text-xl leading-snug text-ink">
                        {moment.title}
                      </p>
                      <p className="timeline-stage-desc mt-1 line-clamp-2 text-xs leading-relaxed text-inkline/70">
                        {moment.description}
                      </p>
                      <span className="timeline-stage-more mt-2 font-mono text-[10px] uppercase tracking-widest text-neonteal">
                        Baca selengkapnya →
                      </span>
                    </button>

                    {moment.driveLink && (
                      <a
                        href={moment.driveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="timeline-stage-drive mt-3 flex items-center justify-center gap-1.5 border-2 border-ink bg-offwhite px-2 py-1.5 font-mono text-[10px] uppercase tracking-widest text-ink shadow-win95sm transition hover:bg-mustard"
                      >
                        📁 Folder Foto
                      </a>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* Detail momen */}
      {activeMoment && (
        <div
          className="timeline-modal-overlay fixed inset-0 z-[100] flex items-center justify-center bg-ink/70 p-4 backdrop-blur-sm"
          onClick={() => setActiveMoment(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="timeline-modal-card relative w-full max-w-md border-4 border-ink bg-offwhite shadow-win95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="timeline-modal-header flex items-center justify-between border-b-4 border-ink bg-neonteal/40 px-4 py-2">
              <p className="timeline-modal-title font-display text-lg text-ink">momen.log</p>
              <button
                onClick={() => setActiveMoment(null)}
                className="timeline-modal-close border-2 border-ink bg-offwhite px-2 py-0.5 font-mono text-xs shadow-win95sm hover:bg-neonrose"
                aria-label="Tutup"
              >
                X
              </button>
            </div>
            <div className="timeline-modal-body p-5">
              <img
                src={activeMoment.photo}
                alt={activeMoment.title}
                className="timeline-modal-photo h-48 w-full border-2 border-ink object-cover sepia-[.2] contrast-105"
              />
              <p className="timeline-modal-date mt-3 font-mono text-xs uppercase tracking-widest text-neonviolet">
                {activeMoment.date}
              </p>
              <h3 className="timeline-modal-name mt-1 font-display text-2xl text-ink">
                {activeMoment.title}
              </h3>
              <p className="timeline-modal-desc mt-2 text-sm leading-relaxed text-inkline/90">
                {activeMoment.description}
              </p>

              {activeMoment.driveLink && (
                <a
                  href={activeMoment.driveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="timeline-modal-drive mt-4 flex items-center justify-center gap-2 border-2 border-ink bg-neonteal/20 px-4 py-2 font-mono text-xs uppercase tracking-widest text-ink shadow-win95sm transition hover:bg-neonteal"
                >
                  📁 Buka Folder Foto di Drive →
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
