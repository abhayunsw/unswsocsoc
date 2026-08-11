import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import heroBanner from '../assets/banner-school-of-athens.jpg'
import deathOfSocrates from '../assets/banner-death-of-socrates.jpg'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { getCurrentTerm, getTermState } from '../lib/termCalendar'
import EventCard from '../components/EventCard.jsx'
import EventDetailModal from '../components/EventDetailModal.jsx'
import AddEventModal from '../components/AddEventModal.jsx'
import TermWrapMessage from '../components/TermWrapMessage.jsx'
import DiscussionViewer from '../components/DiscussionViewer.jsx'

export default function Home() {
  const { user } = useAuth()
  const [weekEvents, setWeekEvents]       = useState([])
  const [currentWeek, setCurrentWeek]     = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [editingEvent, setEditingEvent]   = useState(null)
  const [questionsEvent, setQuestionsEvent] = useState(null)

  const termState   = getTermState()
  const currentTerm = getCurrentTerm()

  const fetchUpcoming = useCallback(async () => {
    const now = new Date().toISOString()
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('term', currentTerm)
      .gte('date', now)
      .order('date', { ascending: true })

    if (error || !data?.length) {
      setWeekEvents([])
      setCurrentWeek(null)
      return
    }

    // Show all events from the same week as the earliest upcoming event
    const firstWeek = data[0].week
    setCurrentWeek(firstWeek)
    setWeekEvents(data.filter(e => e.week === firstWeek))
  }, [currentTerm])

  useEffect(() => { fetchUpcoming() }, [fetchUpcoming])

  const handleDelete = async id => {
    if (!confirm('Delete this event? This cannot be undone.')) return
    if (selectedEvent?.id === id) setSelectedEvent(null)
    await supabase.from('events').delete().eq('id', id)
    fetchUpcoming()
  }

  return (
    <div className="flex flex-col">

      {/* ── Hero ──────────────────────────────────── */}
      <section className="relative h-screen flex items-end overflow-hidden">
        <img
          src={heroBanner}
          alt="School of Athens"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pb-20 md:pb-28 w-full">
          {/* Subtle backdrop behind the small subtitle line for readability */}
          <p className="fade-up fade-up-delay-1 font-display text-xs tracking-[0.4em] text-secondary/90 uppercase mb-4 drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)]">
            University of New South Wales · Est. 2025
          </p>
          <h1 className="fade-up fade-up-delay-2 font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-secondary leading-none tracking-wide mb-6">
            SOCRATIC<br />SOCIETY
          </h1>
          <p className="fade-up fade-up-delay-3 font-serif text-xl md:text-2xl text-secondary/70 italic max-w-lg mb-10 leading-relaxed">
            What do you dare to question?
          </p>
          <div className="fade-up fade-up-delay-4 flex flex-wrap gap-4">
            <Link
              to="/events"
              className="font-sans text-xs tracking-[0.25em] uppercase text-secondary border border-secondary/40 hover:bg-secondary hover:text-primary px-8 py-3.5 transition-all duration-300"
            >
              Upcoming Events
            </Link>
            <Link
              to="/about"
              className="font-sans text-xs tracking-[0.25em] uppercase text-shade1 hover:text-secondary transition-colors px-8 py-3.5"
            >
              About Us →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Philosophy quote strip ──────────────── */}
      <section className="border-y border-white/10 py-8 overflow-hidden">
        <div className="flex gap-16 items-center whitespace-nowrap animate-[slide_30s_linear_infinite]">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="flex items-center gap-16">
              <span className="font-serif text-sm text-shade1 italic">"I know that I know nothing."</span>
              <span className="font-display text-[10px] tracking-[0.3em] text-accent uppercase">· Socrates ·</span>
              <span className="font-serif text-sm text-shade1 italic">"The unexamined life is not worth living."</span>
              <span className="font-display text-[10px] tracking-[0.3em] text-accent uppercase">· Socrates ·</span>
            </span>
          ))}
        </div>
        <style>{`
          @keyframes slide {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }
        `}</style>
      </section>

      {/* ── This week's events / end-of-term wrap ── */}
      {termState.state === 'between' ? (
        <section className="py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
          <TermWrapMessage
            currentTerm={termState.currentTerm}
            nextTerm={termState.nextTerm}
          />
        </section>
      ) : (
        <section className="py-16 md:py-32 px-6 md:px-12 max-w-7xl mx-auto w-full">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <p className="font-display text-[11px] tracking-[0.35em] text-accent uppercase mb-3">
                {currentWeek ? `Week ${currentWeek} · ${currentTerm}` : currentTerm}
              </p>
              <h2 className="font-serif text-4xl md:text-5xl text-secondary">This Week</h2>
            </div>
            <Link
              to="/events"
              className="font-sans text-xs tracking-[0.2em] uppercase text-shade1 hover:text-secondary transition-colors"
            >
              All Events →
            </Link>
          </div>

          {weekEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {weekEvents.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  onSelect={() => setSelectedEvent(event)}
                  onDelete={user ? () => handleDelete(event.id) : null}
                  onEdit={user ? () => setEditingEvent(event) : null}
                  onOpenQuestions={setQuestionsEvent}
                />
              ))}
            </div>
          ) : (
            <p className="font-serif text-xl text-shade1 italic">
              {termState.state === 'unknown'
                ? 'Stay tuned for upcoming events.'
                : 'No upcoming events — check back soon.'}
            </p>
          )}
        </section>
      )}

      {/* ── About strip with Death of Socrates ───── */}
      <section className="relative overflow-hidden">
        <img
          src={deathOfSocrates}
          alt="The Death of Socrates"
          className="w-full h-[60vh] object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/60 md:hidden" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent flex items-center">
          <div className="px-6 md:px-12 max-w-2xl py-16">
            <p className="font-display text-[11px] tracking-[0.35em] text-accent uppercase mb-4">Who We Are</p>
            <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl text-secondary mb-6 leading-tight">
              An inquiry into<br /><em>everything that matters.</em>
            </h2>
            <p className="font-serif text-lg text-secondary/70 leading-relaxed mb-8">
              The Socratic Society is a community dedicated to examining and critically
              discussing the ideas of philosophy's great traditions. We sit in a circle,
              we argue, we question, and we leave a little wiser than we came.
            </p>
            <Link
              to="/about"
              className="font-sans text-xs tracking-[0.25em] uppercase text-secondary border border-secondary/30 hover:bg-secondary hover:text-primary px-8 py-3.5 transition-all duration-300 inline-block"
            >
              Meet the Team
            </Link>
          </div>
        </div>
      </section>

      {/* ── Event detail modal ───────────────────── */}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onEdit={user ? () => { setEditingEvent(selectedEvent); setSelectedEvent(null) } : null}
          onDelete={user ? () => handleDelete(selectedEvent.id) : null}
          onOpenQuestions={setQuestionsEvent}
        />
      )}

      {/* ── Discussion questions viewer ──────────── */}
      {questionsEvent && (
        <DiscussionViewer
          event={questionsEvent}
          onClose={() => setQuestionsEvent(null)}
        />
      )}

      {/* ── Edit event modal ─────────────────────── */}
      {editingEvent && (
        <AddEventModal
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onEventAdded={fetchUpcoming}
        />
      )}
    </div>
  )
}
