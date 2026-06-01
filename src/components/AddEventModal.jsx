import { useState } from 'react'
import { supabase } from '../lib/supabase'

const EVENT_TYPES = ['Discussion', 'Collaborative Discussion', 'Lecture']

const BLANK = { title: '', week: '', type: 'Discussion', date: '', time: '17:00', location: '' }

export default function AddEventModal({ onClose, onEventAdded }) {
  const [form, setForm] = useState(BLANK)
  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      let image_url = null

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

      const { error: insertErr } = await supabase.from('events').insert({
        week:         parseInt(form.week),
        type:         form.type,
        title:        form.title,
        date:         `${form.date}T${form.time}:00`,
        location:     form.location,
        building:     'University of New South Wales',
        image_url,
        question_doc:    null,
        instagram_post:  null,
      })
      if (insertErr) throw insertErr

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
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative bg-[#080808] border border-white/10 w-full max-w-lg max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <p className="font-display text-[10px] tracking-[0.3em] text-accent uppercase mb-1">Admin</p>
            <h2 className="font-serif text-2xl text-secondary">Add Event</h2>
          </div>
          <button
            onClick={onClose}
            className="text-shade1 hover:text-secondary transition-colors font-sans text-xl leading-none"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-6 flex flex-col gap-5">

          {/* Title */}
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

          {/* Week + Type */}
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

          {/* Date + Time */}
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

          {/* Location */}
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

          {/* Image upload */}
          <div>
            <label className={labelClass}>Event Image</label>
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

          {error && (
            <p className="font-sans text-xs text-red-400 tracking-wide">{error}</p>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-2 border-t border-white/10 mt-2">
            <button
              type="submit"
              disabled={loading}
              className="font-sans text-xs tracking-[0.25em] uppercase text-primary bg-secondary hover:bg-secondary/90 px-8 py-3 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? 'Creating…' : 'Create Event'}
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
