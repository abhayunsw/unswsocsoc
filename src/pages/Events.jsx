import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { getCurrentTerm } from '../lib/utils'
import EventCard from '../components/EventCard.jsx'
import EventDetailModal from '../components/EventDetailModal.jsx'
import AddEventModal from '../components/AddEventModal.jsx'

// "26T2" → "262" for sort comparison (newest first = descending)
const termSortKey = t => t.slice(0, 2) + t.slice(3)

export default function Events() {
  const { user } = useAuth()
  const [events, setEvents]           = useState([])
  const [loading, setLoading]         = useState(true)
  const [showModal, setShowModal]     = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showPast, setShowPast]       = useState(false)

  const currentTerm = getCurrentTerm()
  const [selectedTerm, setSelectedTerm] = useState(currentTerm)

  const fetchEvents = useCallback(async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true })
    if (!error) setEvents(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchEvents() }, [fetchEvents])

  // Build sorted unique term list — always include currentTerm so it's selectable
  const allTerms = [
    ...new Set([currentTerm, ...events.map(e => e.term).filter(Boolean)])
  ].sort((a, b) => termSortKey(b).localeCompare(termSortKey(a)))

  const now          = new Date()
  const termEvents   = events.filter(e => e.term === selectedTerm)
  const upcoming     = termEvents.filter(e => new Date(e.date) >= now)
  // Past events shown newest-first (reverse chronological)
  const past         = termEvents.filter(e => new Date(e.date) < now).reverse()

  const handleDelete = async id => {
    if (!confirm('Delete this event? This cannot be undone.')) return
    if (selectedEvent?.id === id) setSelectedEvent(null)
    await supabase.from('events').delete().eq('id', id)
    fetchEvents()
  }

  const handleTermChange = t => {
    setSelectedTerm(t)
    setShowPast(false)
  }

  return (
    <div className="min-h-screen pt-20">

      {/* ── Header ──────────────────────────────── */}
      <div className="border-b border-white/10 px-6 md:px-12 py-10 md:py-16 max-w-7xl mx-auto">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <p className="font-display text-[11px] tracking-[0.35em] text-accent uppercase mb-3">
              {selectedTerm}
            </p>
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-secondary mb-4">Upcoming Events</h1>
            <p className="font-serif text-lg text-shade1 italic max-w-xl">
              Join us each week as we tackle a new question. No experience in philosophy required — only curiosity.
            </p>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            {/* Term selector */}
            {allTerms.length > 1 && (
              <div className="flex items-center gap-3">
                <label className="font-sans text-[11px] tracking-[0.2em] text-shade1 uppercase shrink-0">
                  Term
                </label>
                <select
                  value={selectedTerm}
                  onChange={e => handleTermChange(e.target.value)}
                  className="bg-[#080808] border border-white/20 px-4 py-2.5 text-secondary font-sans text-xs tracking-wider focus:outline-none focus:border-white/40 transition-colors"
                >
                  {allTerms.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            )}

            {user && (
              <button
                onClick={() => setShowModal(true)}
                className="font-sans text-xs tracking-[0.25em] uppercase text-secondary border border-secondary/30 hover:bg-secondary hover:text-primary px-6 py-3 transition-all duration-300 shrink-0"
              >
                + Add Event
              </button>
            )}
          </div>
        </div>
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
              <span className="font-display text-3xl text-accent/70 leading-none mt-1">{n}</span>
              <div>
                <p className="font-display text-xs tracking-[0.2em] text-secondary uppercase mb-2">{label}</p>
                <p className="font-serif text-secondary/70 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Events content ──────────────────────── */}
      <div className="px-6 md:px-12 py-16 max-w-7xl mx-auto">
        {loading ? (
          <p className="font-serif text-xl text-shade1 italic text-center py-20">Loading…</p>

        ) : termEvents.length === 0 ? (
          <p className="font-serif text-xl text-shade1 italic text-center py-20">
            No events recorded for this term.
          </p>

        ) : (
          <>
            {/* Upcoming events */}
            {upcoming.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {upcoming.map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onSelect={() => setSelectedEvent(event)}
                    onDelete={user ? () => handleDelete(event.id) : null}
                    onEdit={user ? () => setEditingEvent(event) : null}
                  />
                ))}
              </div>
            ) : (
              /* No upcoming events empty state */
              <div className="text-center py-16 mb-8">
                <p className="font-serif text-xl text-shade1 italic mb-6">
                  No upcoming events this term.
                </p>
                {past.length > 0 && !showPast && (
                  <button
                    onClick={() => setShowPast(true)}
                    className="font-sans text-xs tracking-[0.25em] uppercase text-secondary border border-secondary/30 hover:bg-secondary hover:text-primary px-6 py-3 transition-all duration-300"
                  >
                    View Past Events
                  </button>
                )}
              </div>
            )}

            {/* Past events — collapsible */}
            {past.length > 0 && (
              <div className="border-t border-white/10 pt-10">
                <button
                  onClick={() => setShowPast(p => !p)}
                  className="flex items-center gap-3 mb-8 group"
                >
                  <span className="font-display text-xs tracking-[0.25em] text-shade1 uppercase group-hover:text-secondary transition-colors">
                    Past Events in This Term
                  </span>
                  <span className="font-display text-[10px] tracking-wider text-accent">
                    ({past.length})
                  </span>
                  <span className="font-sans text-shade1 group-hover:text-secondary transition-colors text-base leading-none">
                    {showPast ? '−' : '+'}
                  </span>
                </button>

                {showPast && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {past.map(event => (
                      <EventCard
                        key={event.id}
                        event={event}
                        onSelect={() => setSelectedEvent(event)}
                        onDelete={user ? () => handleDelete(event.id) : null}
                        onEdit={user ? () => setEditingEvent(event) : null}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Event detail modal ───────────────────── */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onEdit={user ? () => { setEditingEvent(selectedEvent); setSelectedEvent(null) } : null}
          onDelete={user ? () => handleDelete(selectedEvent.id) : null}
        />
      )}

      {/* ── Add event modal ──────────────────────── */}
      {showModal && (
        <AddEventModal
          onClose={() => setShowModal(false)}
          onEventAdded={fetchEvents}
        />
      )}

      {/* ── Edit event modal ─────────────────────── */}
      {editingEvent && (
        <AddEventModal
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onEventAdded={fetchEvents}
        />
      )}
    </div>
  )
}
