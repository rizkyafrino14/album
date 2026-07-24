import { useEffect, useRef, useState } from 'react'
import { soundboardTracks } from '../../data/classData.js'

function parseDurationToSeconds(duration) {
  const [min, sec] = duration.split(':').map(Number)
  return min * 60 + sec
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function AudioCassette() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(null)
  const audioRef = useRef(null)
  const isPlayingRef = useRef(false)
  const trackRefs = useRef({})
  const pendingScrollRef = useRef(false)
  const track = soundboardTracks[currentIndex]
  const fallbackDuration = parseDurationToSeconds(track.duration)
  const effectiveDuration = duration || fallbackDuration

  // Simpan status "sedang main" di ref supaya bisa dibaca effect ganti-track
  // tanpa memicu render ulang / stale closure.
  useEffect(() => {
    isPlayingRef.current = isPlaying
  }, [isPlaying])

  // Setiap kali track berganti (manual atau otomatis), reset progress bar.
  // Kalau sebelumnya sedang playing, lanjutkan otomatis putar track yang baru.
  useEffect(() => {
    setCurrentTime(0)
    setDuration(null)

    const audio = audioRef.current
    if (audio && isPlayingRef.current) {
      audio.play().catch(() => {
        // File audio dummy belum tersedia — tetap tampilkan status "playing" sbg preview visual.
        setIsPlaying(true)
      })
    }

    // Gulir daftar lagu ke track aktif — HANYA kalau memang dipicu aksi (lihat goToTrack),
    // bukan otomatis tiap render/mount. Ini sengaja dibuat action-based (bukan mount-flag)
    // supaya tidak kena efek React StrictMode yang menjalankan effect dua kali saat dev.
    if (pendingScrollRef.current) {
      pendingScrollRef.current = false
      const activeEl = trackRefs.current[track.id]
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onLoadedMetadata = () => {
      if (Number.isFinite(audio.duration)) setDuration(audio.duration)
    }
    // Lagu selesai -> otomatis lanjut ke lagu berikutnya (looping ke awal setelah lagu terakhir).
    const onEnded = () => {
      goToTrack((currentIndex + 1) % soundboardTracks.length)
    }
    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('ended', onEnded)
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('ended', onEnded)
    }
  }, [currentIndex])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // File audio dummy belum tersedia — tetap tampilkan status "playing" sbg preview visual.
          setIsPlaying(true)
        })
    }
  }

  const goToTrack = (index) => {
    pendingScrollRef.current = true
    setCurrentIndex(index)
  }

  const changeTrack = (dir) => {
    goToTrack((currentIndex + dir + soundboardTracks.length) % soundboardTracks.length)
  }

  const handleSeek = (e) => {
    const value = Number(e.target.value)
    setCurrentTime(value)
    if (audioRef.current && Number.isFinite(audioRef.current.duration)) {
      audioRef.current.currentTime = value
    }
  }

  const progressPct = effectiveDuration ? Math.min(100, (currentTime / effectiveDuration) * 100) : 0

  return (
    <section id="suara" className="player-root border-b-4 border-ink bg-[#0B0B0C] px-4 py-16 sm:px-8 md:px-12">
      <div className="player-inner mx-auto max-w-4xl">
        <p className="player-eyebrow font-mono text-xs uppercase tracking-[0.3em] text-neonemerald">
          📼 kapsul_suara_kelas
        </p>
        <h2 className="player-title mt-2 font-display text-4xl text-offwhite">Kapsul Suara Kelas</h2>
        <p className="player-subtitle mt-2 max-w-md text-sm text-offwhite/50">
          Playlist lagu dari teman-teman sekelas. Yuk dengarkan dan rasakan vibe-nya. Klik tombol ▶ untuk mulai memutar.
        </p>

        <div className="player-panel mt-8 flex max-h-[640px] flex-col overflow-hidden rounded-2xl border border-offwhite/10 bg-gradient-to-b from-neonemerald/20 via-[#121212] to-[#121212] shadow-2xl">
          {/* Now playing hero */}
          <div className="player-hero flex flex-shrink-0 flex-col items-center gap-6 p-5 text-center sm:flex-row sm:items-end sm:p-8 sm:text-left">
            <img
              src={track.cover}
              alt={track.title}
              className="player-cover h-32 w-32 flex-shrink-0 rounded-md object-cover shadow-2xl sm:h-40 sm:w-40"
            />
            <div className="player-meta min-w-0">
              <p className="player-meta-label font-mono text-xs uppercase tracking-widest text-offwhite/50">
                Sedang diputar
              </p>
              <h3 className="player-meta-title mt-1 truncate font-display text-3xl text-offwhite sm:text-4xl">
                {track.title}
              </h3>
              <p className="player-meta-artist mt-1 text-sm text-offwhite/60">{track.artist}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="player-controls flex-shrink-0 px-5 pb-6 sm:px-8">
            <input
              type="range"
              min={0}
              max={effectiveDuration || 1}
              step={0.1}
              value={Math.min(currentTime, effectiveDuration || 1)}
              onChange={handleSeek}
              className="player-seekbar h-1 w-full cursor-pointer appearance-none rounded-full bg-offwhite/20 accent-neonemerald"
              style={{
                background: `linear-gradient(to right, #34D399 ${progressPct}%, rgba(255,255,255,0.15) ${progressPct}%)`,
              }}
              aria-label="Posisi lagu"
            />
            <div className="player-times mt-1 flex justify-between font-mono text-[10px] text-offwhite/40">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(effectiveDuration)}</span>
            </div>

            <div className="player-buttons mt-4 flex items-center justify-center gap-6">
              <button
                onClick={() => changeTrack(-1)}
                className="player-btn-skip text-2xl text-offwhite/70 transition hover:text-offwhite"
                aria-label="Track sebelumnya"
              >
                ⏮
              </button>
              <button
                onClick={togglePlay}
                className="player-btn-play flex h-14 w-14 items-center justify-center rounded-full bg-offwhite text-ink shadow-lg transition hover:scale-105"
                aria-label={isPlaying ? 'Jeda' : 'Putar'}
              >
                <span className="text-xl">{isPlaying ? '⏸' : '▶'}</span>
              </button>
              <button
                onClick={() => changeTrack(1)}
                className="player-btn-skip text-2xl text-offwhite/70 transition hover:text-offwhite"
                aria-label="Track selanjutnya"
              >
                ⏭
              </button>
            </div>
          </div>

          <audio ref={audioRef} src={track.src} className="hidden" />

          {/* Header playlist (sticky, tidak ikut scroll) */}
          <div className="player-playlist-header flex flex-shrink-0 items-center justify-between border-t border-offwhite/10 px-5 py-2 sm:px-8">
            <span className="font-mono text-[10px] uppercase tracking-widest text-offwhite/40">
              Daftar Lagu
            </span>
            <span className="font-mono text-[10px] text-offwhite/40">{soundboardTracks.length} lagu</span>
          </div>

          {/* Playlist — scrollable, tinggi kotak player tetap sama */}
          <div className="player-playlist min-h-0 flex-1 overflow-y-auto px-2 pb-3 sm:px-4">
            {soundboardTracks.map((t, idx) => {
              const active = idx === currentIndex
              return (
                <button
                  key={t.id}
                  ref={(el) => {
                    trackRefs.current[t.id] = el
                  }}
                  onClick={() => goToTrack(idx)}
                  className={`player-track group flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition ${
                    active ? 'bg-offwhite/10' : 'hover:bg-offwhite/5'
                  }`}
                >
                  <span
                    className={`player-track-index flex w-5 flex-shrink-0 items-center justify-center gap-[2px] font-mono text-xs ${
                      active ? 'text-neonemerald' : 'text-offwhite/40 group-hover:text-offwhite/70'
                    }`}
                  >
                    {active && isPlaying ? (
                      <>
                        <span className="player-eq-bar h-3 w-[3px] origin-bottom animate-eqBar rounded-full bg-neonemerald [animation-delay:0ms]" />
                        <span className="player-eq-bar h-3 w-[3px] origin-bottom animate-eqBar rounded-full bg-neonemerald [animation-delay:150ms]" />
                        <span className="player-eq-bar h-3 w-[3px] origin-bottom animate-eqBar rounded-full bg-neonemerald [animation-delay:300ms]" />
                      </>
                    ) : (
                      idx + 1
                    )}
                  </span>
                  <img
                    src={t.cover}
                    alt={t.title}
                    className="player-track-cover h-10 w-10 flex-shrink-0 rounded object-cover"
                  />
                  <span className="player-track-meta min-w-0 flex-1">
                    <span
                      className={`player-track-title block truncate text-sm ${
                        active ? 'text-neonemerald' : 'text-offwhite'
                      }`}
                    >
                      {t.title}
                    </span>
                    <span className="player-track-artist block truncate text-xs text-offwhite/40">
                      {t.artist}
                    </span>
                  </span>
                  <span className="player-track-duration flex-shrink-0 font-mono text-xs text-offwhite/40">
                    {t.duration}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
