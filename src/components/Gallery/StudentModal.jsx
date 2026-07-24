import { useEffect } from 'react'

export default function StudentModal({ student, onClose }) {
  useEffect(() => {
    if (!student) return

    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [student, onClose])

  if (!student) return null

  return (
    <div
      className="modal-overlay fixed inset-0 z-[100] flex items-center justify-center bg-ink/70 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Detail siswa ${student.name}`}
    >
      <div
        className="modal-card relative w-full max-w-lg animate-floatSlow border-4 border-ink bg-offwhite shadow-win95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header flex items-center justify-between border-b-4 border-ink bg-mustard px-4 py-2">
          <p className="modal-header-title font-display text-lg tracking-wide text-ink">
            biodata_siswa.json
          </p>
          <button
            onClick={onClose}
            className="modal-close border-2 border-ink bg-offwhite px-2 py-0.5 font-mono text-xs shadow-win95sm hover:bg-neonrose"
            aria-label="Tutup modal"
          >
            X
          </button>
        </div>

        <div className="modal-body grid gap-4 p-5 sm:grid-cols-[120px_1fr]">
          <img
            src={student.photo}
            alt={student.name}
            className="modal-photo mx-auto h-32 w-32 border-2 border-ink object-cover shadow-win95sm sm:mx-0 sm:h-full sm:w-full"
          />

          <div className="modal-info">
            <h3 className="modal-name font-display text-3xl text-ink">{student.name}</h3>
            <p className="modal-role font-mono text-xs uppercase tracking-widest text-neonviolet">
              {student.role}
            </p>

            <dl className="modal-fields mt-3 space-y-1 font-mono text-xs text-inkline">
              <div className="modal-field flex gap-2">
                <dt className="text-ink/50">tgl_lahir:</dt>
                <dd>{student.birthDate}</dd>
              </div>
              <div className="modal-field flex gap-2">
                <dt className="text-ink/50">instagram:</dt>
                <dd>{student.instagram}</dd>
              </div>
              <div className="modal-field flex gap-2">
                <dt className="text-ink/50">github:</dt>
                <dd>{student.github}</dd>
              </div>
            </dl>

            <blockquote className="modal-quote mt-3 border-l-4 border-neonteal pl-3 text-sm italic text-inkline">
              “{student.quote}”
            </blockquote>

            <div className="modal-skills mt-4 flex flex-wrap gap-2">
              {student.skills.map((skill) => (
                <span
                  key={skill}
                  className="modal-skill-tag border-2 border-ink bg-paper px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-ink shadow-win95sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
