import { events } from '../data/events.js'
import EventCard from '../components/EventCard.jsx'

export default function Events() {
  return (
    <div className="min-h-screen pt-20">

      {/* ── Header ──────────────────────────────── */}
      <div className="border-b border-white/10 px-6 md:px-12 py-10 md:py-16 max-w-7xl mx-auto">
        <p className="font-display text-[11px] tracking-[0.35em] text-accent uppercase mb-3">This Term</p>
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-secondary mb-4">Upcoming Events</h1>
        <p className="font-serif text-lg text-shade1 italic max-w-xl">
          Join us each week as we tackle a new question. No experience in philosophy required — only curiosity.
        </p>
      </div>

      {/* ── How events work ─────────────────────── */}
      <div className="px-6 md:px-12 py-12 max-w-7xl mx-auto border-b border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { n: '01', label: 'The Topic',    desc: 'A provocative question is chosen for the week and announced on Instagram.' },
            { n: '02', label: 'The Circle',   desc: 'We sit together, questions are handed out, and the discussion begins. Every voice matters.' },
            { n: '03', label: 'The Dialogue', desc: 'No lectures, no right answers. Just honest inquiry in the tradition of Socrates.' },
          ].map(({ n, label, desc }) => (
            <div key={n} className="flex gap-5">
              <span className="font-display text-3xl text-accent/40 leading-none mt-1">{n}</span>
              <div>
                <p className="font-display text-xs tracking-[0.2em] text-secondary uppercase mb-2">{label}</p>
                <p className="font-serif text-shade1 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Events grid ─────────────────────────── */}
      <div className="px-6 md:px-12 py-16 max-w-7xl mx-auto">
        {events.length === 0 ? (
          <p className="font-serif text-xl text-shade1 italic text-center py-20">
            No events scheduled yet. Check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
