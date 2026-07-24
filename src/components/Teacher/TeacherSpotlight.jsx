import { homeroomTeacher } from '../../data/classData.js'

export default function TeacherSpotlight() {
  return (
    <section
      id="wali-kelas"
      className="teacher-root relative overflow-hidden border-b-4 border-ink bg-cream px-6 py-16 md:px-12"
    >
      <div
        className="teacher-bg-dots pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(33,31,27,0.1) 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }}
      />

      <div className="teacher-inner relative mx-auto max-w-4xl">
        <p className="teacher-eyebrow font-mono text-xs uppercase tracking-[0.3em] text-neonviolet">
          🎓 sosok_di_balik_kelas
        </p>
        <h2 className="teacher-title mt-2 font-display text-4xl text-ink">Wali Kelas Kami</h2>
        <p className="teacher-subtitle mt-2 max-w-xl text-sm text-inkline/80">
          Tanpa beliau, kelas ini cuma kumpulan siswa. Dengan beliau, kelas ini jadi keluarga.
        </p>

        <div className="teacher-card relative mt-10 overflow-hidden border-4 border-ink bg-gradient-to-br from-offwhite via-offwhite to-paper p-6 shadow-win95 sm:p-8">
          {/* Pita penghargaan di pojok — di-clip rapi oleh overflow-hidden pada kartu */}
          <div className="teacher-ribbon absolute -right-11 top-5 w-40 rotate-45 border-y-2 border-ink bg-mustard py-1 text-center shadow-win95sm sm:-right-12 sm:top-6 sm:w-48">
            <span className="teacher-ribbon-text font-mono text-[8px] uppercase tracking-widest text-ink sm:text-[10px]">
              ★ {homeroomTeacher.badge} ★ {homeroomTeacher.badge} ★
            </span>
          </div>

          <div className="teacher-profile grid gap-6 sm:grid-cols-[180px_1fr] sm:items-center">
            <div className="teacher-photo-frame mx-auto w-40 border-4 border-mustard bg-offwhite p-2 shadow-win95 sm:w-full">
              <img
                src={homeroomTeacher.photo}
                alt={homeroomTeacher.name}
                className="teacher-photo h-48 w-full border-2 border-ink object-cover sepia-[.15] contrast-105 sm:h-56"
              />
            </div>

            <div className="teacher-info min-w-0 text-center sm:text-left">
              <p className="teacher-role font-mono text-xs uppercase tracking-widest text-neonteal">
                {homeroomTeacher.title}
              </p>
              <h3 className="teacher-name mt-1 font-display text-4xl text-ink">
                {homeroomTeacher.name}
              </h3>
              <p className="teacher-subject mt-1 font-mono text-sm text-neonviolet">
                {homeroomTeacher.subject}
              </p>
              <p className="teacher-years mt-1 font-mono text-xs text-ink/50">
                {homeroomTeacher.yearsTeaching}
              </p>

              <blockquote className="teacher-motto mx-auto mt-4 max-w-sm border-l-4 border-neonteal pl-3 text-left text-sm italic text-inkline sm:mx-0">
                “{homeroomTeacher.motto}”
              </blockquote>
            </div>
          </div>

          {/* Pesan wali kelas ala catatan tulisan tangan */}
          <div className="teacher-letter relative mt-8 border-2 border-dashed border-ink/40 bg-offwhite/70 p-5 sm:p-6">
            <p className="teacher-letter-label font-mono text-[10px] uppercase tracking-widest text-ink/50">
              Pesan untuk kalian
            </p>
            <p className="teacher-letter-message mt-3 text-sm leading-relaxed text-inkline/90">
              {homeroomTeacher.message}
            </p>
            <p className="teacher-signature mt-4 text-right font-signature text-3xl text-ink/80 sm:text-4xl">
              {homeroomTeacher.name}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
