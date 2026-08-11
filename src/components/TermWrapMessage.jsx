import { Link } from 'react-router-dom'

/**
 * End-of-term message shown when getTermState() reports 'between'.
 * `variant="full"` — homepage block with quote + buttons.
 * `variant="compact"` — events page: label, one line, next term.
 */
export default function TermWrapMessage({ currentTerm, nextTerm, variant = 'full' }) {
  const label = (
    <p className="font-display text-[11px] tracking-[0.35em] text-accent uppercase mb-6">
      {currentTerm} · That's a Wrap
    </p>
  )

  if (variant === 'compact') {
    return (
      <div className="bg-primary text-center py-16 px-6">
        {label}
        <p className="font-serif text-xl md:text-2xl text-secondary/80 italic leading-relaxed max-w-2xl mx-auto">
          {currentTerm} has come to a close — thank you to all who gathered and questioned.
        </p>
        <p className="font-serif text-lg text-shade1 mt-4">
          We'll see you in {nextTerm}.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-primary text-center py-20 md:py-28 px-6 md:px-12">
      {label}

      <h2 className="font-serif italic text-3xl sm:text-4xl md:text-5xl text-secondary leading-tight max-w-3xl mx-auto mb-8">
        “Thank you to all who gathered, questioned, and dared to think.”
      </h2>

      <p className="font-serif text-lg md:text-xl text-secondary/70 leading-relaxed max-w-2xl mx-auto mb-12">
        Another term of Socratic dialogue comes to an end.
        <br />
        We'll see you in {nextTerm} — until then, the questions remain open.
      </p>

      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          to={`/events?term=${currentTerm}&past=1`}
          className="font-sans text-xs tracking-[0.25em] uppercase text-secondary border border-secondary/40 hover:bg-secondary hover:text-primary px-8 py-3.5 transition-all duration-300"
        >
          View Past Events
        </Link>
        <Link
          to={`/events?term=${currentTerm}&past=1#past-events`}
          className="font-sans text-xs tracking-[0.25em] uppercase text-accent border border-accent/40 hover:bg-accent hover:text-secondary px-8 py-3.5 transition-all duration-300"
        >
          Read Discussion Questions
        </Link>
      </div>
    </div>
  )
}
