import { useState, useEffect, useRef, useMemo } from 'react'

/**
 * Questions are numbered continuously across the whole handout, so each
 * thinker's first question picks up where the previous thinker left off.
 * Returns the starting global number for each section, parallel to `thinkers`.
 */
function startingNumbers(thinkers) {
  let n = 1
  return thinkers.map(t => {
    const start = n
    n += t.questions?.length ?? 0
    return start
  })
}

const slug = (name, i) => `thinker-${i}-${(name ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`

export default function DiscussionViewer({ event, onClose }) {
  const data = event.question_json
  const thinkers = data?.thinkers ?? []
  const starts = useMemo(() => startingNumbers(thinkers), [thinkers])

  const [activeIndex, setActiveIndex] = useState(0)
  const scrollRef  = useRef(null)
  const sectionRefs = useRef([])
  const tabRefs     = useRef([])
  // Suppresses scroll-spy while a tab click animates, so the active tab doesn't
  // flicker through intermediate sections on the way to the target.
  const lockRef = useRef(false)

  // Close on Escape, and lock background scroll while the overlay is open
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [onClose])

  // Scroll spy — the active thinker is the last section whose heading has
  // passed the top offset of the scroll container.
  useEffect(() => {
    const root = scrollRef.current
    if (!root) return

    const onScroll = () => {
      if (lockRef.current) return
      const threshold = root.getBoundingClientRect().top + 180
      let current = 0
      sectionRefs.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= threshold) current = i
      })
      setActiveIndex(current)
    }

    root.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => root.removeEventListener('scroll', onScroll)
  }, [thinkers.length])

  // Keep the active tab visible in the horizontally-scrolling mobile tab bar
  useEffect(() => {
    tabRefs.current[activeIndex]?.scrollIntoView({
      behavior: 'smooth', block: 'nearest', inline: 'center',
    })
  }, [activeIndex])

  const goToThinker = i => {
    const el = sectionRefs.current[i]
    if (!el) return
    setActiveIndex(i)
    lockRef.current = true
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.setTimeout(() => { lockRef.current = false }, 800)
  }

  if (!data) return null

  return (
    <div className="fixed inset-0 z-50 bg-primary grain">
      {/* ── Close — fixed top right ─────────────── */}
      <button
        onClick={onClose}
        aria-label="Close discussion questions"
        className="fixed top-4 right-4 z-30 font-sans text-[10px] tracking-widest uppercase
                   text-shade1 hover:text-secondary bg-black/80 border border-white/10
                   hover:border-secondary/30 px-3 py-1.5 transition-all duration-200"
      >
        ✕
      </button>

      <div ref={scrollRef} className="h-full overflow-y-auto">

        {/* ── Sticky header + tab bar ───────────── */}
        <div className="sticky top-0 z-20 bg-primary/95 backdrop-blur-sm border-b border-white/10">
          <div className="max-w-4xl mx-auto px-6 md:px-12 pt-6 pb-4 md:pt-8">
            <p className="font-display text-[10px] md:text-[11px] tracking-[0.3em] text-accent uppercase mb-2 pr-12">
              Week {event.week} · {event.type}
            </p>
            <h1 className="font-display text-xl md:text-3xl text-secondary leading-snug pr-12">
              {data.topic || event.title}
            </h1>
          </div>

          {thinkers.length > 0 && (
            <div className="max-w-4xl mx-auto px-6 md:px-12">
              <div className="flex gap-6 md:gap-8 overflow-x-auto no-scrollbar -mb-px">
                {thinkers.map((t, i) => (
                  <button
                    key={i}
                    ref={el => { tabRefs.current[i] = el }}
                    onClick={() => goToThinker(i)}
                    className={`shrink-0 font-display text-[10px] md:text-[11px] tracking-[0.2em] uppercase
                                whitespace-nowrap pb-3 border-b-2 transition-colors duration-300
                                ${i === activeIndex
                                  ? 'text-accent border-accent'
                                  : 'text-shade1 border-transparent hover:text-secondary'}`}
                  >
                    {t.thinkerName || t.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Thinker sections ──────────────────── */}
        <div className="max-w-4xl mx-auto px-6 md:px-12 pb-24">
          {thinkers.map((t, i) => (
            <section
              key={i}
              id={slug(t.thinkerName || t.name, i)}
              ref={el => { sectionRefs.current[i] = el }}
              className={`scroll-mt-40 pt-14 md:pt-20 ${i > 0 ? 'border-t border-white/10' : ''}`}
            >
              {t.name && t.name !== t.thinkerName && (
                <p className="font-display text-[10px] tracking-[0.3em] text-shade1 uppercase mb-3">
                  {t.name}
                </p>
              )}

              <h2 className="font-display text-2xl md:text-4xl text-accent leading-tight mb-6">
                {t.thinkerName || t.name}
              </h2>

              {t.premise && (
                <p className="font-serif text-[18px] text-secondary leading-[1.85] mb-8">
                  {t.premise}
                </p>
              )}

              {t.quote && (
                <blockquote className="border-l-2 border-accent pl-5 md:pl-6 my-8">
                  <p className="font-serif italic text-base md:text-[17px] text-secondary/85 leading-relaxed">
                    “{t.quote}”
                  </p>
                  {t.source && (
                    <footer className="font-display text-[10px] tracking-[0.25em] text-shade1 uppercase mt-3">
                      — {t.source}
                    </footer>
                  )}
                </blockquote>
              )}

              {t.questions?.length > 0 && (
                <ol className="flex flex-col gap-6 mt-10">
                  {t.questions.map((q, qi) => (
                    <li key={qi} className="flex gap-4 md:gap-5">
                      <span className="font-display text-sm md:text-base text-accent leading-[1.7] shrink-0 tabular-nums">
                        {starts[i] + qi}.
                      </span>
                      <span className="font-serif text-[17px] md:text-[18px] text-secondary leading-[1.75]">
                        {q}
                      </span>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          ))}

          {/* ── Final question ──────────────────── */}
          {data.finalQuestion && (
            <div className="border-t border-white/10 mt-16 pt-16 text-center">
              <p className="font-display text-[10px] tracking-[0.3em] text-accent uppercase mb-6">
                To Close
              </p>
              <p className="font-serif italic text-2xl md:text-3xl text-secondary leading-snug max-w-2xl mx-auto">
                {data.finalQuestion}
              </p>
            </div>
          )}

          {/* ── Download original ───────────────── */}
          {event.question_doc && (
            <div className="text-center mt-16">
              <a
                href={event.question_doc}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-display text-[10px] tracking-[0.25em]
                           uppercase text-shade1 hover:text-secondary border-b border-transparent
                           hover:border-secondary/40 pb-1 transition-all duration-300"
              >
                ↓ Download Original Handout
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
