const TYPE_LABELS = {
  'Discussion':               'Discussion',
  'Collaborative Discussion':  'Collab',
  'Lecture':                   'Lecture',
}

function formatDate(isoString) {
  const d = new Date(isoString)
  return {
    day:  d.toLocaleDateString('en-AU', { weekday: 'short' }),
    date: d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' }),
    time: d.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: true }),
  }
}

function isReleased(isoString) {
  return new Date() >= new Date(isoString)
}

export default function EventCard({ event, onDelete }) {
  const { day, date, time } = formatDate(event.date)
  const released = isReleased(event.date)

  return (
    <div className="event-card group relative overflow-hidden bg-shade2/20 border border-white/10 flex flex-col">

      {/* Poster image */}
      <div className="relative overflow-hidden aspect-video">
        {event.image_url ? (
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-shade2/40 flex items-center justify-center">
            <span className="font-serif text-6xl text-shade1/20 italic select-none">Φ</span>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Week + type badge */}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="font-display text-[10px] tracking-[0.2em] text-secondary bg-accent px-3 py-1">
            WEEK {event.week}
          </span>
          <span className="font-display text-[10px] tracking-[0.2em] text-shade1 bg-black/60 border border-white/10 px-3 py-1">
            {TYPE_LABELS[event.type] || event.type}
          </span>
        </div>

        {/* Admin delete button */}
        {onDelete && (
          <button
            onClick={onDelete}
            className="absolute top-4 right-4 font-sans text-[10px] tracking-widest uppercase text-shade1 hover:text-secondary bg-black/80 border border-white/10 hover:border-secondary/30 px-3 py-1 transition-all duration-200"
          >
            Delete
          </button>
        )}
      </div>

      {/* Info */}
      <div className="p-6 flex flex-col gap-4 flex-1">

        {/* Date + time row */}
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

        {/* Title */}
        <h3 className="font-serif text-2xl md:text-3xl text-secondary italic leading-snug">
          "{event.title}"
        </h3>

        {/* Discussion questions */}
        <div className="mt-auto pt-4 border-t border-white/10">
          {event.question_doc && released ? (
            <a
              href={`/src/assets/questions/${event.question_doc}`}
              download
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
