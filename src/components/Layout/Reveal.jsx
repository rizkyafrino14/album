import { useEffect, useRef, useState } from 'react'

const directionClasses = {
  up: { hidden: 'translate-y-12 opacity-0', shown: 'translate-y-0 opacity-100' },
  left: { hidden: '-translate-x-12 opacity-0', shown: 'translate-x-0 opacity-100' },
  right: { hidden: 'translate-x-12 opacity-0', shown: 'translate-x-0 opacity-100' },
}

/**
 * Membungkus section/elemen apapun agar muncul dengan animasi fade + slide
 * begitu elemen tersebut masuk ke area layar saat di-scroll.
 * Animasi hanya berjalan sekali per elemen (tidak mengulang saat scroll naik-turun).
 */
export default function Reveal({ children, className = '', delay = 0, direction = 'up' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const variant = directionClasses[direction] || directionClasses.up

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
      className={`reveal-wrap transform transition-all duration-700 ease-out ${
        visible ? variant.shown : variant.hidden
      } ${className}`}
    >
      {children}
    </div>
  )
}
