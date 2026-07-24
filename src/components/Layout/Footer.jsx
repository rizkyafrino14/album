import { classInfo } from '../../data/classData.js'

export default function Footer() {
  return (
    <footer className="footer-root border-t-4 border-ink bg-ink py-8 text-offwhite">
      <div className="footer-inner mx-auto max-w-6xl px-4 text-center">
        <p className="footer-brand font-display text-xl tracking-wide text-mustard">
          {classInfo.shortName} // {classInfo.year}
        </p>
        <p className="footer-note mt-2 font-mono text-xs text-offwhite/60">
          console.log("dibuat dengan &lt;3 oleh Rizky Mustafa Afrino & disupport oleh teman-teman 10 RPL 4");<br />
        </p>
        <div className="footer-blink mt-4 inline-block animate-blink font-mono text-neonteal">
          █
        </div>
      </div>
    </footer>
  )
}
