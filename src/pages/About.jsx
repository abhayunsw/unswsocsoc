import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import TeamCard from '../components/TeamCard.jsx'
import TeamModal from '../components/TeamModal.jsx'
import TeamMemberModal from '../components/TeamMemberModal.jsx'
import heroBanner from '../assets/banner-school-of-athens.jpg'

const ADMIN_EMAIL = 'abhayunsw@gmail.com'

export default function About() {
  const { user } = useAuth()
  const isAdmin = user?.email === ADMIN_EMAIL

  const [team, setTeam] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingMember, setEditingMember] = useState(null)
  const [selectedMember, setSelectedMember] = useState(null)

  const fetchTeam = useCallback(async () => {
    const { data } = await supabase
      .from('team')
      .select('*')
      .order('display_order', { ascending: true })
    if (data) setTeam(data)
  }, [])

  useEffect(() => { fetchTeam() }, [fetchTeam])

  const handleDelete = async id => {
    if (!confirm('Remove this team member? This cannot be undone.')) return
    await supabase.from('team').delete().eq('id', id)
    fetchTeam()
  }

  return (
    <div className="min-h-screen pt-20">

      {/* ── Header image strip ──────────────────── */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={heroBanner}
          alt="School of Athens"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/40 to-black" />
        <div className="absolute inset-0 flex items-end px-6 md:px-12 pb-12 max-w-7xl mx-auto">
          <div>
            <p className="font-display text-[11px] tracking-[0.35em] text-accent uppercase mb-2">UNSW Arc Club</p>
            <h1 className="font-serif text-5xl md:text-6xl text-secondary">About Us</h1>
          </div>
        </div>
      </div>

      {/* ── Mission ─────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 border-b border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div>
            <p className="font-display text-[11px] tracking-[0.3em] text-accent uppercase mb-4">Our Mission</p>
            <h2 className="font-serif text-3xl md:text-4xl text-secondary italic leading-snug mb-6">
              "The unexamined life is not worth living."
            </h2>
            <p className="font-sans text-xs tracking-[0.2em] text-shade1 uppercase mb-2">— Socrates</p>
          </div>

          <div className="flex flex-col gap-5">
            <p className="font-serif text-lg text-secondary/80 leading-relaxed">
              The Socratic Society is an in-person community dedicated to examining and critically
              discussing the ideas of the various traditions and prominent thinkers of philosophy.
            </p>
            <p className="font-serif text-lg text-secondary/80 leading-relaxed">
              We are a community for those in pursuit of truth and wisdom that offers everything
              philosophy on campus. Our primary goal is to critically engage with philosophical ideas,
              arguments and questions through Socratic dialogue, debates, and discussions.
            </p>
            <p className="font-serif text-lg text-secondary/80 leading-relaxed">
              We seek to determine fundamental truths about the nature of reality, knowledge, ethics
              and aesthetic judgments by exploring varied opinions from different schools of thought.
            </p>
          </div>
        </div>
      </div>

      {/* ── Fun fact ────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 border-b border-white/10">
        <div className="bg-accent/10 border border-accent/20 px-5 py-6 md:px-8 md:py-8 max-w-3xl">
          <p className="font-display text-[10px] tracking-[0.3em] text-accent uppercase mb-3">Fun Fact</p>
          <p className="font-serif text-xl text-secondary/80 leading-relaxed italic">
            Socrates wandered Athens asking questions none could answer. The Oracle at Delphi said
            he was the wisest man in Athens because he knew that he knew nothing.
          </p>
          <p className="font-serif text-lg text-secondary mt-4 font-semibold">
            What do you dare to question?
          </p>
        </div>
      </div>

      {/* ── Team ────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <p className="font-display text-[11px] tracking-[0.35em] text-accent uppercase mb-3">The People</p>
            <h2 className="font-serif text-3xl md:text-5xl text-secondary">Executive Team 2025</h2>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowModal(true)}
              className="font-sans text-xs tracking-[0.25em] uppercase text-secondary border border-secondary/30 hover:bg-secondary hover:text-primary px-6 py-3 transition-all duration-300 shrink-0"
            >
              + Add Member
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {team.map(member => (
            <TeamCard
              key={member.id}
              member={member}
              onSelect={() => setSelectedMember(member)}
              onEdit={isAdmin ? () => setEditingMember(member) : null}
              onDelete={isAdmin ? () => handleDelete(member.id) : null}
            />
          ))}
        </div>
      </div>

      {/* ── Member profile modal ────────────────────── */}
      {selectedMember && (
        <TeamMemberModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      )}

      {/* ── Add member modal ─────────────────────── */}
      {showModal && (
        <TeamModal
          onClose={() => setShowModal(false)}
          onSaved={fetchTeam}
        />
      )}

      {/* ── Edit member modal ────────────────────── */}
      {editingMember && (
        <TeamModal
          member={editingMember}
          onClose={() => setEditingMember(null)}
          onSaved={fetchTeam}
        />
      )}
    </div>
  )
}
