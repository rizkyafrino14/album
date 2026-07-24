import { useState } from 'react'
import { scrollToSection } from '../../utils/scrollToSection.js'

const navLinks = [
  { href: '#beranda', label: 'Beranda' },
  { href: '#wali-kelas', label: 'Wali Kelas' },
  { href: '#galeri', label: 'Buku Induk' },
  { href: '#linimasa', label: 'Linimasa' },
  { href: '#suara', label: 'Kapsul Suara' },
  { href: '#roda-kenangan', label: 'Roda Kenangan' },
  { href: '#tebak-siapa', label: 'Tebak Siapa' },
  { href: '#peta', label: 'Peta Lab' },
  { href: '#surat', label: 'Kotak Surat' },
]

export default function Navbar() {
  const [navOpen, setNavOpen] = useState(false)

  const handleNavClick = (e, href) => {
    e.preventDefault()
    scrollToSection(href.slice(1))
    setNavOpen(false)
  }

  return (
    <header className="nav-root sticky top-0 z-50 animate-slideDown border-b-4 border-ink bg-offwhite/95 backdrop-blur">
      <div className="nav-inner mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a
          href="#beranda"
          onClick={(e) => handleNavClick(e, '#beranda')}
          className="nav-brand shrink-0 font-display text-lg tracking-wide text-ink sm:text-2xl"
        >
          <span className="nav-brand-bracket text-neonviolet">&lt;</span>
          X_RPL_ALBUM
          <span className="nav-brand-bracket text-neonviolet">/&gt;</span>
        </a>

        <nav className="nav-links hidden gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="nav-link rounded-sm px-3 py-2 font-mono text-xs uppercase tracking-wide text-ink transition-colors hover:bg-mustard hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button
          className="nav-toggle border-2 border-ink bg-paper px-3 py-2 font-mono text-xs shadow-win95sm md:hidden"
          onClick={() => setNavOpen((v) => !v)}
          aria-expanded={navOpen}
          aria-label="Buka menu navigasi"
        >
          {navOpen ? 'TUTUP' : 'MENU'}
        </button>
      </div>

      {navOpen && (
        <nav className="nav-mobile grid grid-cols-2 gap-2 border-t-4 border-ink bg-paper p-4 md:hidden">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="nav-mobile-link border-2 border-ink bg-offwhite px-2 py-2 text-center font-mono text-xs uppercase shadow-win95sm"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}
