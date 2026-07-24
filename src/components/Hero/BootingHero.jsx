import { useEffect, useState } from 'react'
import { classInfo } from '../../data/classData.js'
import { scrollToSection } from '../../utils/scrollToSection.js'

const bootLines = [
  'BIOS X-RPL v2026.1 ................ OK',
  'Memeriksa memori kelas ............ 36 Siswa terdeteksi',
  'Memuat driver pertemanan ........... OK',
  'Mounting /kenangan/tahun-2025 ...... OK',
  'Menghubungkan ke Lab RPL ........... OK',
  'Menjalankan album_kenangan.exe ..... ',
]

export default function BootingHero() {
  const [visibleLines, setVisibleLines] = useState([])
  const [booted, setBooted] = useState(false)
  const [skip, setSkip] = useState(false)

  useEffect(() => {
    if (skip) {
      setBooted(true)
      return
    }
    let i = 0
    const interval = setInterval(() => {
      i += 1
      setVisibleLines(bootLines.slice(0, i))
      if (i >= bootLines.length) {
        clearInterval(interval)
        setTimeout(() => setBooted(true), 500)
      }
    }, 280)
    return () => clearInterval(interval)
  }, [skip])

  return (
    <section id="beranda" className="hero-root relative overflow-hidden border-b-4 border-ink bg-crt">
      {!booted && (
        <div className="hero-boot flex min-h-[70vh] flex-col justify-center bg-crt px-6 py-10 font-mono text-sm text-neonemerald sm:text-base">
          <div className="hero-boot-lines mx-auto w-full max-w-2xl space-y-1">
            {visibleLines.map((line, idx) => (
              <p key={idx} className="hero-boot-line whitespace-pre">
                {line}
              </p>
            ))}
            {visibleLines.length > 0 && visibleLines.length < bootLines.length && (
              <span className="hero-boot-cursor animate-blink">_</span>
            )}
          </div>
          <button
            onClick={() => setSkip(true)}
            className="hero-boot-skip mx-auto mt-8 w-fit border-2 border-neonemerald px-4 py-1 font-mono text-xs uppercase tracking-widest text-neonemerald transition hover:bg-neonemerald hover:text-crt"
          >
            [ Lewati boot ]
          </button>
        </div>
      )}

      {booted && (
        <div className="hero-content relative grid gap-10 px-6 py-16 md:grid-cols-2 md:items-center md:px-12">
          <div
            className="hero-scanline pointer-events-none absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, #34D399 0px, transparent 2px, transparent 4px)',
            }}
          />
          <div className="hero-text relative z-10">
            <p className="hero-eyebrow font-mono text-xs uppercase tracking-[0.3em] text-neonteal">
              class_album --version 2025/2026
            </p>
            <h1 className="hero-title mt-3 break-words font-display text-4xl leading-none text-offwhite sm:text-5xl md:text-6xl">
              Album Kenangan {classInfo.shortName}
            </h1>
            <p className="hero-tagline mt-4 font-mono text-sm text-mustard">{classInfo.tagline}</p>
            <p className="hero-vision mt-6 max-w-md text-sm leading-relaxed text-offwhite/80">
              {classInfo.vision}
            </p>
            <ul className="hero-mission mt-4 space-y-1">
              {classInfo.mission.map((item, idx) => (
                <li key={idx} className="hero-mission-item flex gap-2 text-sm text-offwhite/70">
                  <span className="text-neonviolet">$</span> {item}
                </li>
              ))}
            </ul>
            <a
              href="#galeri"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection('galeri')
              }}
              className="hero-cta mt-8 inline-block border-2 border-mustard bg-mustard px-5 py-3 font-mono text-xs uppercase tracking-widest text-ink shadow-win95 transition hover:-translate-y-0.5 hover:shadow-neonteal"
            >
              Buka Buku Induk Digital →
            </a>
          </div>

          <div className="hero-photo-wrap relative z-10">
            <div className="hero-photo-frame border-4 border-offwhite bg-offwhite p-3 shadow-win95 sm:p-4">
              <img
                src={classInfo.groupPhoto}
                alt="Foto bersama kelas X RPL"
                className="hero-photo h-64 w-full object-cover sepia-[.35] contrast-110 saturate-75 sm:h-80"
              />
              <p className="hero-photo-caption mt-2 text-center font-mono text-[10px] uppercase tracking-widest text-ink/60">
                foto_angkatan_{classInfo.year.replace(/\s|\//g, '')}.jpg
              </p>
            </div>
            <div className="hero-photo-tape absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 -rotate-3 bg-mustard/80" />
          </div>
        </div>
      )}
    </section>
  )
}
