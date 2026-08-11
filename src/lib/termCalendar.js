// Hardcoded UNSW term dates. Extend this array as future term dates are published.
export const TERM_CALENDAR = [
  {
    term: '26T1',
    oWeekStart:    '2026-02-09',
    teachingStart: '2026-02-16',
    teachingEnd:   '2026-04-24',  // week 10 end
    nextTerm:      '26T2',
  },
  {
    term: '26T2',
    oWeekStart:    '2026-05-25',
    teachingStart: '2026-06-01',
    teachingEnd:   '2026-08-07',  // week 10 end
    nextTerm:      '26T3',
  },
  {
    term: '26T3',
    oWeekStart:    '2026-09-07',
    teachingStart: '2026-09-14',
    teachingEnd:   '2026-11-20',  // week 10 end
    nextTerm:      '27T1',
  },
]

// Normalises a Date (or anything Date accepts) to a 'YYYY-MM-DD' string in
// Sydney local time, so comparisons against the calendar are timezone-safe.
function toSydneyDateString(input) {
  const d = input instanceof Date ? input : new Date(input)
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Australia/Sydney',
    year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(d)
  const get = type => parts.find(p => p.type === type)?.value ?? ''
  return `${get('year')}-${get('month')}-${get('day')}`
}

/**
 * Determines where `today` sits in the term calendar.
 *
 *   'active'  — inside O-Week or teaching weeks of a term
 *   'between' — after a term's teachingEnd but before the next term's O-Week
 *   'unknown' — before the first term or beyond every hardcoded term
 *
 * Returns { state, currentTerm, nextTerm } — currentTerm/nextTerm are null
 * when the state is 'unknown'.
 */
export function getTermState(today = new Date()) {
  const date = toSydneyDateString(today)

  for (const t of TERM_CALENDAR) {
    // Inside O-Week or teaching — dates are ISO strings so string compare works
    if (date >= t.oWeekStart && date <= t.teachingEnd) {
      return { state: 'active', currentTerm: t.term, nextTerm: t.nextTerm }
    }
  }

  // Not inside any term — check the gaps between consecutive terms
  for (let i = 0; i < TERM_CALENDAR.length; i++) {
    const t    = TERM_CALENDAR[i]
    const next = TERM_CALENDAR[i + 1]
    if (date > t.teachingEnd && (!next || date < next.oWeekStart)) {
      // Past the last hardcoded term's break with no following term on record
      if (!next) return { state: 'unknown', currentTerm: null, nextTerm: null }
      return { state: 'between', currentTerm: t.term, nextTerm: t.nextTerm }
    }
  }

  // Before the first hardcoded term
  return { state: 'unknown', currentTerm: null, nextTerm: null }
}

/**
 * The term string to use for pre-filling forms and default filters:
 * the active term, or the most recently ended term when between terms.
 * Falls back to the last hardcoded term once the calendar runs out.
 */
export function getCurrentTerm(today = new Date()) {
  const { state, currentTerm } = getTermState(today)
  if (state !== 'unknown') return currentTerm

  const date = toSydneyDateString(today)
  // Beyond the calendar → most recent term; before it → the first term
  const past = TERM_CALENDAR.filter(t => date > t.teachingEnd)
  if (past.length) return past[past.length - 1].term
  return TERM_CALENDAR[0]?.term ?? null
}
