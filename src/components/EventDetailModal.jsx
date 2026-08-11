import { useAuth } from '../context/AuthContext'

const TZ = 'Australia/Sydney'

function formatDateTime(isoString) {
  const d = new Date(isoString)
  return {
    weekday: d.toLocaleDateString('en-AU', { timeZone: TZ, weekday: 'long' }),
    day:     d.toLocaleDateString('en-AU', { timeZone: TZ, day: 'numeric' }),
    month:   d.toLocaleDateString('en-AU', { timeZone: TZ, month: 'long' }),
    year:    d.toLocaleDateString('en-AU', { timeZone: TZ, year: 'numeric' }),
    time:    d.toLocaleTimeString('en-AU', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hour12: true }),
  }
}

export default function EventDetailModal({ event, onClose, onEdit, onDelete, onOpenQuestions }) {
  const { user } = useAuth()
  const { weekday, day, month, year, time } = formatDateTime(event.date)
  // Released on the calendar day of the event (Sydney time), not after the start time
  const nowDate   = new Date().toLocaleDateString('en-CA', { timeZone: TZ })
  const eventDate = new Date(event.date).toLocaleDateString('en-CA', { timeZone: TZ })
  const released  = nowDate >= eventDate
  // Structured questions get the in-site viewer; a bare .docx still links out
  const hasViewer = Boolean(event.question_json) && released

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center md:p-6"
      onClick={onClose}
    >
      {/*
        Mobile:  full-screen, single column, vertically scrollable
        Desktop: two-column row, fixed 85vh height, image left / details right
      */}
      <div
        className="
          relative bg-[#080808] border border-white/10
          w-full h-full overflow-y-auto
          md:h-[85vh] md:max-w-[900px] md:overflow-hidden md:flex md:flex-row
        "
        onClick={e => e.stopPropagation()}
      >

        {/* ── Close button — always top-right of the whole modal ── */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="
            absolute top-4 right-4 z-20
            font-sans text-[10px] tracking-widest uppercase
            text-shade1 hover:text-secondary
            bg-black/80 border border-white/10 hover:border-secondary/30
            px-3 py-1.5 transition-all duration-200
          "
        >
          ✕
        </button>

        {/* ── LEFT: poster image ── */}
        {/*
          Mobile:  full width, aspect-[3/4] portrait
          Desktop: 55% width, fills full modal height via object-cover
        */}
        <div className="w-full aspect-[3/4] flex-shrink-0 overflow-hidden md:w-[55%] md:aspect-auto md:h-full">
          {event.image_url ? (
            <img
              src={event.image_url}
              alt={event.title}
              className="w-full h-full object-contain object-center"
            />
          ) : (
            <div className="w-full h-full bg-shade2/40 flex items-center justify-center">
              <span className="font-serif text-8xl text-shade1/20 italic select-none">Φ</span>
            </div>
          )}
        </div>

        {/* ── RIGHT: event details ── */}
        {/*
          Desktop: scrollable flex column, padded, fills remaining width
          Mobile:  normal flow, padding, stacks below the image
        */}
        <div className="flex flex-col gap-5 px-6 py-8 md:flex-1 md:overflow-y-auto md:px-8 md:py-8">

          {/* Week · Type badge */}
          <div className="flex gap-2 flex-wrap pr-10">
            <span className="font-display text-[10px] tracking-[0.2em] text-secondary bg-accent px-3 py-1">
              WEEK {event.week}
            </span>
            <span className="font-display text-[10px] tracking-[0.2em] text-shade1 border border-white/10 px-3 py-1">
              {event.type}
            </span>
            {event.term && (
              <span className="font-display text-[10px] tracking-[0.2em] text-shade1 border border-white/10 px-3 py-1">
                {event.term}
              </span>
            )}
          </div>

          {/* Title */}
          <h2 className="font-serif text-3xl md:text-4xl text-secondary italic leading-snug">
            "{event.title}"
          </h2>

          {/* Date / time / location */}
          <div className="flex items-start gap-4 border-t border-white/10 pt-5">
            <div className="text-center min-w-[56px]">
              <p className="font-display text-[9px] tracking-widest text-shade1 uppercase">{weekday}</p>
              <p className="font-serif text-3xl text-secondary leading-none mt-0.5">{day}</p>
              <p className="font-display text-[9px] tracking-widest text-shade1 uppercase mt-1">
                {month} {year}
              </p>
            </div>
            <div className="w-px h-14 bg-white/10 self-center" />
            <div className="flex flex-col gap-1.5">
              <p className="font-sans text-xs tracking-widest text-shade1">{time}</p>
              <p className="font-sans text-xs tracking-widest text-shade1">{event.location}</p>
            </div>
          </div>

          {/* Caption */}
          {event.caption && (
            <div className="border-t border-white/10 pt-5">
              <p className="font-serif text-sm text-secondary/80 leading-relaxed whitespace-pre-line">
                {event.caption}
              </p>
            </div>
          )}

          {/* Discussion questions + social links */}
          <div className="border-t border-white/10 pt-5 flex flex-col gap-4">
            {hasViewer && (
              <button
                onClick={() => onOpenQuestions?.(event)}
                className="inline-flex items-center gap-2 font-sans text-xs tracking-[0.2em] uppercase text-secondary hover:text-accent border border-secondary/30 hover:border-accent px-4 py-2.5 transition-all duration-300 w-fit"
              >
                <span>Discussion Questions</span>
              </button>
            )}
            {!hasViewer && event.question_doc && released && (
              <a
                href={event.question_doc}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-sans text-xs tracking-[0.2em] uppercase text-secondary hover:text-accent border border-secondary/30 hover:border-accent px-4 py-2.5 transition-all duration-300 w-fit"
              >
                <span>↓</span>
                <span>Discussion Questions</span>
              </a>
            )}
            {event.question_doc && !released && (
              <p className="font-sans text-[11px] tracking-widest text-shade1 uppercase">
                ⧗ Questions released on the day
              </p>
            )}

            <div className="flex flex-wrap gap-5">
              {event.instagram_post && (
                <a
                  href={event.instagram_post}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-[11px] tracking-widest text-shade1 hover:text-secondary uppercase transition-colors"
                >
                  Instagram →
                </a>
              )}
              {event.facebook_post && (
                <a
                  href={event.facebook_post}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-[11px] tracking-widest text-shade1 hover:text-secondary uppercase transition-colors"
                >
                  Facebook →
                </a>
              )}
            </div>
          </div>

          {/* Admin: Edit / Delete — bottom of right panel */}
          {user && (onEdit || onDelete) && (
            <div className="border-t border-white/10 pt-5 mt-auto flex gap-3">
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="font-sans text-[10px] tracking-widest uppercase text-shade1 hover:text-secondary border border-white/10 hover:border-secondary/30 px-4 py-2 transition-all duration-200"
                >
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="font-sans text-[10px] tracking-widest uppercase text-shade1 hover:text-secondary border border-white/10 hover:border-secondary/30 px-4 py-2 transition-all duration-200"
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
