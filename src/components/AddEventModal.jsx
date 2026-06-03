import { useState } from 'react'
import { supabase } from '../lib/supabase'

const EVENT_TYPES = ['Discussion', 'Collaborative Discussion', 'Lecture']

function blankForm() {
  return { title: '', week: '', type: 'Discussion', date: '', time: '17:00', location: '', instagram_post: '' }
}

function formFromEvent(event) {
  const d = new Date(event.date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return {
    title: event.title ?? '',
    week: event.week?.toString() ?? '',
    type: event.type ?? 'Discussion',
    date: `${year}-${month}-${day}`,
    time: `${hours}:${minutes}`,
    location: event.location ?? '',
    instagram_post: event.instagram_post ?? '',
  }
}

export default function AddEventModal({ onClose, onEventAdded, event = null }) {
  const isEdit = event !== null
  const [form, setForm] = useState(isEdit ? formFromEvent(event) : blankForm())
  const [imageFile, setImageFile] = useState(null)
  const [questionFile, setQuestionFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      let image_url = isEdit ? event.image_url : null
      let question_doc = isEdit ? event.question_doc : null

      if (imageFile) {
        const ext = imageFile.name.split('.').pop()
        const filename = `${Date.now()}.${ext}`
        const { error: uploadErr } = await supabase.storage
          .from('event-images')
          .upload(filename, imageFile)
        if (uploadErr) throw uploadErr
        const { data: { publicUrl } } = supabase.storage
          .from('event-images')
          .getPublicUrl(filename)
        image_url = publicUrl
      }

      if (questionFile) {
        const ext = questionFile.name.split('.').pop()
        const filename = `questions/${Date.now()}.${ext}`
        const { error: uploadErr } = await supabase.storage
          .from('event-images')
          .upload(filename, questionFile)
        if (uploadErr) throw uploadErr
        const { data: { publicUrl } } = supabase.storage
          .from('event-images')
          .getPublicUrl(filename)
        question_doc = publicUrl
      }

      const payload = {
        week:           parseInt(form.week),
        type:           form.type,
        title:          form.title,
        date:           `${form.date}T${form.time}:00`,
        location:       form.location,
        building:       'University of New South Wales',
        image_url,
        question_doc,
        instagram_post: form.instagram_post || null,
      }

      if (isEdit) {
        const { error: updateErr } = await supabase
          .from('events').update(payload).eq('id', event.id)
        if (updateErr) throw updateErr
      } else {
        const { error: insertErr } = await supabase.from('events').insert(payload)
        if (insertErr) throw insertErr
      }

      onEventAdded()
      onClose()
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const inputClass =
    'w-full bg-transparent border border-white/20 px-4 py-2.5 text-secondary font-serif text-sm focus:outline-none focus:border-white/40 transition-colors placeholder:text-shade1/40'

  const labelClass =
    'font-sans text-[11px] tracking-[0.2em] text-shade1 uppercase block mb-2'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-[#080808] border border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto">

        <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <p className="font-display text-[10px] tracking-[0.3em] text-accent uppercase mb-1">Admin</p>
            <h2 className="font-serif text-2xl text-secondary">{isEdit ? 'Edit Event' : 'Add Event'}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-shade1 hover:text-secondary transition-colors font-sans text-xl leading-none"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-6 flex flex-col gap-5">

          <div>
            <label className={labelClass}>Title</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={set('title')}
              placeholder="Is Religion A Scam?"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Week</label>
              <input
                type="number"
                required
                min="1"
                value={form.week}
                onChange={set('week')}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Type</label>
              <select
                value={form.type}
                onChange={set('type')}
                className="w-full bg-[#080808] border border-white/20 px-4 py-2.5 text-secondary font-sans text-xs tracking-wider focus:outline-none focus:border-white/40 transition-colors"
              >
                {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Date</label>
              <input
                type="date"
                required
                value={form.date}
                onChange={set('date')}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Time</label>
              <input
                type="time"
                required
                value={form.time}
                onChange={set('time')}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Location</label>
            <input
              type="text"
              required
              value={form.location}
              onChange={set('location')}
              placeholder="Morven Brown G3"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Instagram Post URL</label>
            <input
              type="url"
              value={form.instagram_post}
              onChange={set('instagram_post')}
              placeholder="https://www.instagram.com/p/…"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              Event Image{isEdit && event.image_url ? ' — leave blank to keep existing' : ''}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={e => setImageFile(e.target.files[0])}
              className="w-full font-sans text-xs text-shade1
                file:mr-4 file:py-2 file:px-4
                file:border file:border-white/20 file:bg-transparent
                file:text-secondary file:font-sans file:text-[11px] file:tracking-widest
                file:uppercase file:cursor-pointer
                hover:file:border-white/40 file:transition-colors"
            />
          </div>

          <div>
            <label className={labelClass}>
              Discussion Questions (PDF or DOCX){isEdit && event.question_doc ? ' — leave blank to keep existing' : ''}
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={e => setQuestionFile(e.target.files[0])}
              className="w-full font-sans text-xs text-shade1
                file:mr-4 file:py-2 file:px-4
                file:border file:border-white/20 file:bg-transparent
                file:text-secondary file:font-sans file:text-[11px] file:tracking-widest
                file:uppercase file:cursor-pointer
                hover:file:border-white/40 file:transition-colors"
            />
          </div>

          {error && (
            <p className="font-sans text-xs text-red-400 tracking-wide">{error}</p>
          )}

          <div className="flex gap-4 pt-2 border-t border-white/10 mt-2">
            <button
              type="submit"
              disabled={loading}
              className="font-sans text-xs tracking-[0.25em] uppercase text-primary bg-secondary hover:bg-secondary/90 px-8 py-3 transition-all duration-300 disabled:opacity-50"
            >
              {loading
                ? (isEdit ? 'Saving…' : 'Creating…')
                : (isEdit ? 'Save Changes' : 'Create Event')}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="font-sans text-xs tracking-[0.25em] uppercase text-shade1 hover:text-secondary border border-white/20 hover:border-white/40 px-8 py-3 transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
