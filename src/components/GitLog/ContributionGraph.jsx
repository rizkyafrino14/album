import { useMemo, useState } from 'react'
import { memoryContributions } from '../../data/classData.js'

const levelColors = [
  'bg-offwhite/10',
  'bg-neonemerald/25',
  'bg-neonemerald/50',
  'bg-neonemerald/75',
  'bg-neonemerald',
]

const monthNamesId = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
]

const dayLabels = ['', 'Sen', '', 'Rab', '', 'Jum', '']

function toDateKey(date) {
  return date.toISOString().slice(0, 10)
}

function buildCalendar(entries) {
  const byDate = new Map(entries.map((e) => [e.date, e]))
  const dates = entries.map((e) => new Date(e.date + 'T00:00:00'))
  const minDate = new Date(Math.min(...dates))
  const maxDate = new Date(Math.max(...dates))

  // Mundur ke hari Minggu terdekat sebelum tanggal paling awal
  const start = new Date(minDate)
  start.setDate(start.getDate() - start.getDay())

  // Maju ke hari Sabtu terdekat setelah tanggal paling akhir
  const end = new Date(maxDate)
  end.setDate(end.getDate() + (6 - end.getDay()))

  const weeks = []
  let cursor = new Date(start)
  while (cursor <= end) {
    const week = []
    for (let d = 0; d < 7; d += 1) {
      const key = toDateKey(cursor)
      const entry = byDate.get(key)
      week.push({
        date: new Date(cursor),
        key,
        level: entry ? entry.level : 0,
        message: entry ? entry.message : null,
      })
      cursor.setDate(cursor.getDate() + 1)
    }
    weeks.push(week)
  }
  return weeks
}

export default function ContributionGraph() {
  const [hovered, setHovered] = useState(null)

  const weeks = useMemo(() => buildCalendar(memoryContributions), [])

  const monthLabels = useMemo(() => {
    let lastMonth = -1
    return weeks.map((week) => {
      const firstDay = week[0].date
      const month = firstDay.getMonth()
      if (month !== lastMonth) {
        lastMonth = month
        return monthNamesId[month]
      }
      return null
    })
  }, [weeks])

  const totalMoments = memoryContributions.length
  const busiestMonth = useMemo(() => {
    const counts = {}
    memoryContributions.forEach((e) => {
      const m = new Date(e.date + 'T00:00:00').getMonth()
      counts[m] = (counts[m] || 0) + e.level
    })
    const topMonth = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
    return topMonth ? monthNamesId[Number(topMonth[0])] : '-'
  }, [])

  const cellSize = 13

  return (
    <section id="gitlog" className="gitlog-root border-b-4 border-ink bg-crt px-6 py-16 md:px-12">
      <div className="gitlog-inner mx-auto max-w-5xl">
        <p className="gitlog-eyebrow font-mono text-xs uppercase tracking-[0.3em] text-neonemerald">
          ⌨️ git_log_of_memories
        </p>
        <h2 className="gitlog-title mt-2 font-display text-4xl text-offwhite">
          Grafik Kontribusi Kenangan
        </h2>
        <p className="gitlog-subtitle mt-2 max-w-xl text-sm text-offwhite/60">
          Setiap kotak mewakili satu hari sepanjang tahun ajaran. Arahkan atau ketuk kotak untuk
          membaca "commit message" hari itu.
        </p>

        <div className="gitlog-stats mt-6 flex flex-wrap gap-3">
          <div className="gitlog-stat border-2 border-neonemerald/40 bg-offwhite/5 px-4 py-2 font-mono text-xs text-offwhite/80">
            <span className="text-neonemerald">{totalMoments}</span> momen tercatat
          </div>
          <div className="gitlog-stat border-2 border-neonemerald/40 bg-offwhite/5 px-4 py-2 font-mono text-xs text-offwhite/80">
            Bulan paling rame: <span className="text-neonemerald">{busiestMonth}</span>
          </div>
        </div>

        <div className="gitlog-card mt-6 overflow-x-auto border-2 border-neonemerald/30 bg-black/40 p-4 sm:p-6">
          <div className="gitlog-scroll-area inline-block min-w-full">
            {/* Baris label bulan */}
            <div className="gitlog-months mb-1 flex gap-[3px] pl-8">
              {monthLabels.map((label, idx) => (
                <div
                  key={idx}
                  style={{ width: cellSize }}
                  className="gitlog-month-cell relative flex-shrink-0"
                >
                  {label && (
                    <span className="gitlog-month-label absolute left-0 whitespace-nowrap font-mono text-[9px] text-offwhite/50">
                      {label}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="gitlog-body flex gap-[3px]">
              {/* Label hari */}
              <div className="gitlog-day-labels mr-1 flex w-7 flex-shrink-0 flex-col justify-between gap-[3px]">
                {dayLabels.map((label, idx) => (
                  <span
                    key={idx}
                    style={{ height: cellSize }}
                    className="gitlog-day-label flex items-center font-mono text-[9px] text-offwhite/40"
                  >
                    {label}
                  </span>
                ))}
              </div>

              {/* Grid minggu x hari */}
              <div className="gitlog-weeks flex gap-[3px]">
                {weeks.map((week, wIdx) => (
                  <div key={wIdx} className="gitlog-week flex flex-col gap-[3px]">
                    {week.map((day) => (
                      <div key={day.key} className="gitlog-cell-wrap relative">
                        <button
                          onMouseEnter={() => setHovered(day)}
                          onFocus={() => setHovered(day)}
                          onMouseLeave={() => setHovered(null)}
                          onBlur={() => setHovered(null)}
                          onClick={() => setHovered((h) => (h?.key === day.key ? null : day))}
                          style={{ width: cellSize, height: cellSize }}
                          className={`gitlog-cell rounded-[3px] border border-black/40 transition-transform hover:scale-125 ${levelColors[day.level]}`}
                          aria-label={
                            day.message ? `${day.key}: ${day.message}` : `${day.key}: tidak ada momen`
                          }
                        />
                        {hovered?.key === day.key && day.message && (
                          <div className="gitlog-tooltip absolute bottom-full left-1/2 z-20 mb-2 w-56 -translate-x-1/2 border-2 border-neonemerald bg-ink px-3 py-2 font-mono text-[10px] leading-snug text-offwhite shadow-win95sm">
                            {day.message}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="gitlog-legend mt-4 flex items-center gap-2 pl-8 font-mono text-[10px] text-offwhite/50">
            <span>Sepi</span>
            {levelColors.map((c, idx) => (
              <span key={idx} className={`gitlog-legend-swatch h-3 w-3 rounded-[2px] border border-black/40 ${c}`} />
            ))}
            <span>Rame Banget</span>
          </div>
        </div>
      </div>
    </section>
  )
}
