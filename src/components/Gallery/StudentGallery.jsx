import { useMemo, useState } from 'react'
import { students } from '../../data/classData.js'
import StudentModal from './StudentModal.jsx'

export default function StudentGallery() {
  const [query, setQuery] = useState('')
  const [showAll, setShowAll] = useState(false)
  const [activeStudent, setActiveStudent] = useState(null)

  const hasQuery = query.trim().length > 0

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return showAll ? students : []
    return students.filter(
      (s) => s.name.toLowerCase().includes(q) || s.nickname.toLowerCase().includes(q)
    )
  }, [query, showAll])

  const handleQueryChange = (e) => {
    setQuery(e.target.value)
  }

  return (
    <section id="galeri" className="gallery-root border-b-4 border-ink bg-cream px-6 py-16 md:px-12">
      <div className="gallery-inner mx-auto max-w-6xl">
        <p className="gallery-eyebrow font-mono text-xs uppercase tracking-[0.3em] text-neonviolet">
          buku_induk_digital
        </p>
        <h2 className="gallery-title mt-2 font-display text-4xl text-ink">Galeri Siswa</h2>
        <p className="gallery-subtitle mt-2 max-w-xl text-sm text-inkline/80">
          Ketik nama untuk membuka disket kenangan siswa tersebut.
        </p>

        <div className="gallery-search mt-6 flex max-w-sm items-center gap-2 border-2 border-ink bg-offwhite px-3 py-2 shadow-win95sm">
          <span className="gallery-search-icon font-mono text-ink/50">🔍</span>
          <input
            type="text"
            value={query}
            onChange={handleQueryChange}
            placeholder="Cari nama siswa..."
            className="gallery-search-input w-full bg-transparent font-mono text-sm text-ink outline-none placeholder:text-ink/40"
          />
        </div>

        {/* Belum ada pencarian & belum pilih "tampilkan semua" -> sembunyikan foto */}
        {!hasQuery && !showAll && (
          <div className="gallery-placeholder mt-8 flex flex-col items-center gap-4 border-2 border-dashed border-ink/30 bg-offwhite/40 px-6 py-12 text-center">
            <span className="gallery-placeholder-icon text-4xl">🗄️</span>
            <p className="gallery-placeholder-text max-w-sm font-mono text-sm text-ink/60">
              Ketik nama kamu di kotak pencarian untuk membuka
              disketnya satu per satu.
            </p>
            <button
              onClick={() => setShowAll(true)}
              className="gallery-placeholder-btn border-2 border-ink bg-mustard px-4 py-2 font-mono text-xs uppercase tracking-widest text-ink shadow-win95sm transition hover:-translate-y-0.5 hover:shadow-neonviolet"
            >
              Atau tampilkan semua siswa →
            </button>
          </div>
        )}

        {(hasQuery || showAll) && (
          <div className="gallery-grid mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((student, idx) => (
              <button
                key={student.id}
                onClick={() => setActiveStudent(student)}
                style={{ animationDelay: `${idx * 60}ms` }}
                className="gallery-card group relative flex animate-cardEnter flex-col border-2 border-ink bg-[#1B1A17] p-3 text-left shadow-win95 transition hover:-translate-y-1 hover:shadow-neonviolet"
              >
                <div className="gallery-card-slot flex h-3 items-center justify-center">
                  <div className="gallery-card-slot-bar h-1 w-10 bg-offwhite/30" />
                </div>
                <div className="gallery-card-photo mt-2 overflow-hidden border-2 border-offwhite/20">
                  <img
                    src={student.photo}
                    alt={student.name}
                    className="gallery-card-img h-32 w-full object-cover grayscale-[10%] transition group-hover:scale-105"
                  />
                </div>
                <p className="gallery-card-label mt-3 font-mono text-[10px] uppercase tracking-widest text-neonteal">
                  disk_{student.id}.img
                </p>
                <p className="gallery-card-name font-display text-xl text-offwhite">{student.nickname}</p>
                <p className="gallery-card-role font-mono text-[10px] text-offwhite/50">{student.role}</p>
              </button>
            ))}
          </div>
        )}

        {hasQuery && filtered.length === 0 && (
          <p className="gallery-empty mt-8 font-mono text-sm text-ink/60">
            Tidak ada siswa dengan nama tersebut. Coba kata kunci lain.
          </p>
        )}

        {showAll && !hasQuery && filtered.length > 0 && (
          <button
            onClick={() => setShowAll(false)}
            className="gallery-hide-btn mt-6 border-2 border-ink bg-offwhite px-4 py-2 font-mono text-xs uppercase tracking-widest text-ink shadow-win95sm transition hover:bg-neonrose"
          >
            Sembunyikan lagi
          </button>
        )}
      </div>

      <StudentModal student={activeStudent} onClose={() => setActiveStudent(null)} />
    </section>
  )
}
