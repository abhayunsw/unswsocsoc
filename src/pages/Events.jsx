import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import EventCard from '../components/EventCard.jsx'
import AddEventModal from '../components/AddEventModal.jsx'

export default function Events() {
  const { user } = useAuth()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)

  const fetchEvents = useCallback(async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true })
    if (!error) setEvents(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchEvents() }, [fetchEvents])

  const handleDelete = async id => {
    if (!confirm('Delete this event? This cannot be undone.')) return
    await supabase.from('events').delete().eq('id', id)
    fetchEvents()
  }

  return (
    <div className="min-h-screen pt-20">

      {/* ── Header ──────────────────────────────── */}
      <div className="border-b border-white/10 px-6 md:px-12 py-10 md:py-16 max-w-7xl mx-auto">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="font-display text-[11px] tracking-[0.35em] text-accent uppercase mb-3">This Term</p>
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-secondary mb-4">Upcoming Events</h1>
            <p className="font-serif text-lg text-shade1 italic max-w-xl">
              Join us each week as we tackle a new question. No experience in philosophy required — only curiosity.
            </p>
          </div>
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
        {loading ? (
          <p className="font-serif text-xl text-shade1 italic text-center py-20">Loading…</p>
        ) : events.length === 0 ? (
          <p className="font-serif text-xl text-shade1 italic text-center py-20">
            No events scheduled yet. Check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onDelete={user ? () => handleDelete(event.id) : null}
                onEdit={user ? () => setEditingEvent(event) : null}
              />
            ))}
          </div>
        )}
      </div>

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
