import { useState } from 'react'
import { initialGuestbookMessages } from '../../data/classData.js'

export default function Guestbook() {
  const [messages, setMessages] = useState(initialGuestbookMessages)
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.message.trim()) {
      setError('Nama dan pesan wajib diisi ya!')
      return
    }
    setError('')
    const newMessage = {
      id: `gb-${Date.now()}`,
      name: form.name.trim(),
      email: form.email.trim() || 'anonim@rpl.local',
      message: form.message.trim(),
      date: new Date().toISOString().slice(0, 10),
    }
    setMessages((prev) => [newMessage, ...prev])
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <section id="surat" className="guestbook-root border-b-4 border-ink bg-crt px-6 py-16 md:px-12">
      <div className="guestbook-inner mx-auto max-w-3xl">
        <p className="guestbook-eyebrow font-mono text-xs uppercase tracking-[0.3em] text-neonviolet">
          kotak_surat_kelas
        </p>
        <h2 className="guestbook-title mt-2 font-display text-4xl text-offwhite">Kesan &amp; Pesan</h2>
        <p className="guestbook-subtitle mt-2 max-w-xl text-sm text-offwhite/60">
          Tinggalkan jejak sebelum lulus. Semua pesan langsung tampil di bawah.
        </p>

        <form
          onSubmit={handleSubmit}
          className="guestbook-form mt-8 border-2 border-offwhite/30 bg-offwhite/5 p-5"
        >
          <div className="guestbook-form-row grid gap-4 sm:grid-cols-2">
            <label className="guestbook-field flex flex-col gap-1">
              <span className="guestbook-label font-mono text-[10px] uppercase tracking-widest text-offwhite/60">
                Nama
              </span>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="guestbook-input border-2 border-offwhite/40 bg-crt px-3 py-2 font-mono text-sm text-offwhite outline-none focus:border-neonteal"
                placeholder="Nama kamu"
              />
            </label>
            <label className="guestbook-field flex flex-col gap-1">
              <span className="guestbook-label font-mono text-[10px] uppercase tracking-widest text-offwhite/60">
                Email (opsional)
              </span>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="guestbook-input border-2 border-offwhite/40 bg-crt px-3 py-2 font-mono text-sm text-offwhite outline-none focus:border-neonteal"
                placeholder="nama@email.com"
              />
            </label>
          </div>

          <label className="guestbook-field mt-4 flex flex-col gap-1">
            <span className="guestbook-label font-mono text-[10px] uppercase tracking-widest text-offwhite/60">
              Pesan
            </span>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={3}
              className="guestbook-textarea border-2 border-offwhite/40 bg-crt px-3 py-2 font-mono text-sm text-offwhite outline-none focus:border-neonteal"
              placeholder="Tulis kesan dan pesan kamu di sini..."
            />
          </label>

          {error && <p className="guestbook-error mt-2 font-mono text-xs text-neonrose">{error}</p>}

          <button
            type="submit"
            className="guestbook-submit mt-4 border-2 border-neonteal bg-neonteal/10 px-5 py-2 font-mono text-xs uppercase tracking-widest text-neonteal transition hover:bg-neonteal hover:text-crt"
          >
            Kirim Pesan →
          </button>
        </form>

        <ul className="guestbook-list mt-8 space-y-4">
          {messages.map((msg) => (
            <li
              key={msg.id}
              className="guestbook-item border-2 border-offwhite/20 bg-offwhite/5 p-4"
            >
              <div className="guestbook-item-header flex flex-wrap items-baseline justify-between gap-2">
                <p className="guestbook-item-name font-display text-lg text-mustard">{msg.name}</p>
                <p className="guestbook-item-date font-mono text-[10px] text-offwhite/40">{msg.date}</p>
              </div>
              <p className="guestbook-item-email font-mono text-[10px] text-offwhite/40">{msg.email}</p>
              <p className="guestbook-item-message mt-2 text-sm leading-relaxed text-offwhite/85">
                {msg.message}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
