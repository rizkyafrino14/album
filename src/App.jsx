import { useEffect } from 'react'
import Navbar from './components/Layout/Navbar.jsx'
import Footer from './components/Layout/Footer.jsx'
import Reveal from './components/Layout/Reveal.jsx'
import BootingHero from './components/Hero/BootingHero.jsx'
import TeacherSpotlight from './components/Teacher/TeacherSpotlight.jsx'
import StudentGallery from './components/Gallery/StudentGallery.jsx'
import MemoryTimeline from './components/Timeline/MemoryTimeline.jsx'
import AudioCassette from './components/Soundboard/AudioCassette.jsx'
import MemoryWheel from './components/MemoryWheel/MemoryWheel.jsx'
import GuessTheClassmate from './components/Arcade/GuessTheClassmate.jsx'
import LabSeatMap from './components/SeatMap/LabSeatMap.jsx'
import Guestbook from './components/Guestbook/Guestbook.jsx'

export default function App() {
  // Lapisan pengaman terakhir: pastikan halaman selalu mulai dari paling atas
  // setelah seluruh konten selesai dirender (mis. saat pertama dimuat/refresh).
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="app-root min-h-screen font-body text-ink">
      <Navbar />
      <main>
        <BootingHero />
        <Reveal>
          <TeacherSpotlight />
        </Reveal>
        <Reveal>
          <StudentGallery />
        </Reveal>
        <Reveal>
          <MemoryTimeline />
        </Reveal>
        <Reveal>
          <AudioCassette />
        </Reveal>
        <Reveal>
          <MemoryWheel />
        </Reveal>
        <Reveal>
          <GuessTheClassmate />
        </Reveal>
        <Reveal>
          <LabSeatMap />
        </Reveal>
        <Reveal>
          <Guestbook />
        </Reveal>
      </main>
      <Footer />
    </div>
  )
}
