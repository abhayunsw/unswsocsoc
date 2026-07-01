const TYPE_LABELS = {
  'Discussion':              'Discussion',
  'Collaborative Discussion': 'Collab',
  'Lecture':                 'Lecture',
  'Meeting':                 'Meeting',
  'Debate':                  'Debate',
}

const TZ = 'Australia/Sydney'

function formatDate(isoString) {
  const d = new Date(isoString)
  return {
    day:  d.toLocaleDateString('en-AU', { timeZone: TZ, weekday: 'short' }),
    date: d.toLocaleDateString('en-AU', { timeZone: TZ, day: 'numeric', month: 'short' }),
    time: d.toLocaleTimeString('en-AU', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: true }),
  }
}

function isReleased(isoString) {
  // Released on the calendar day of the event (Sydney time), not after the start time
  const nowDate   = new Date().toLocaleDateString('en-CA', { timeZone: TZ })
  const eventDate = new Date(isoString).toLocaleDateString('en-CA', { timeZone: TZ })
  return nowDate >= eventDate
}

export default function EventCard({ event, onSelect, onDelete, onEdit }) {
  const { day, date, time } = formatDate(event.date)
  const released = isReleased(event.date)

  return (
    <div
      className="event-card group relative overflow-hidden bg-shade2/20 border border-white/10 flex flex-col cursor-pointer"
      onClick={onSelect}
    >

      {/* Poster image */}
      <div className="relative overflow-hidden aspect-[3/4]">
        {event.image_url ? (
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-shade2/40 flex items-center justify-center">
            <span className="font-serif text-6xl text-shade1/20 italic select-none">Φ</span>
          </div>
        )}

        {/* Bottom-to-top gradient for badge legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Combined week + type badge — bottom left */}
        <div className="absolute bottom-4 left-4">
          <span className="font-display text-[10px] tracking-[0.2em] text-secondary bg-black/70 border border-white/10 px-3 py-1">
            WEEK {event.week} · {TYPE_LABELS[event.type] || event.type}
          </span>
        </div>

        {/* Admin controls — top right, stop propagation so they don't open the modal */}
        {(onEdit || onDelete) && (
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            {onEdit && (
              <button
                onClick={e => { e.stopPropagation(); onEdit() }}
                className="font-sans text-[10px] tracking-widest uppercase text-shade1 hover:text-secondary bg-black/80 border border-white/10 hover:border-secondary/30 px-3 py-1 transition-all duration-200"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={e => { e.stopPropagation(); onDelete() }}
                className="font-sans text-[10px] tracking-widest uppercase text-shade1 hover:text-secondary bg-black/80 border border-white/10 hover:border-secondary/30 px-3 py-1 transition-all duration-200"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-6 flex flex-col gap-4 flex-1">

        <div className="flex items-center gap-3">
          <div className="text-center min-w-[48px]">
            <p className="font-display text-[10px] tracking-widest text-shade1 uppercase">{day}</p>
            <p className="font-serif text-2xl text-secondary leading-none">{date}</p>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div>
            <p className="font-sans text-xs tracking-widest text-shade1">{time}</p>
            <p className="font-sans text-xs tracking-widest text-shade1 mt-0.5">{event.location}</p>
          </div>
        </div>

        <h3 className="font-serif text-2xl md:text-3xl text-secondary italic leading-snug">
          "{event.title}"
        </h3>

        <div className="mt-auto pt-4 border-t border-white/10">
          {event.question_doc && released ? (
            <a
              href={event.question_doc}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="inline-flex items-center gap-2 font-sans text-xs tracking-[0.2em] uppercase text-secondary hover:text-accent border border-secondary/30 hover:border-accent px-4 py-2.5 transition-all duration-300"
            >
              <span>↓</span>
              <span>Discussion Questions</span>
            </a>
          ) : (
            <p className="font-sans text-[11px] tracking-widest text-shade1 uppercase">
              {released
                ? 'Questions not yet uploaded'
                : '⧗ Questions released on the day'}
            </p>
          )}

          {event.instagram_post && (
            <a
              href={event.instagram_post}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="mt-3 inline-flex items-center gap-2 font-sans text-[11px] tracking-widest text-shade1 hover:text-secondary uppercase transition-colors"
            >
              View on Instagram →
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
