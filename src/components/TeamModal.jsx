import { useState } from 'react'
import { supabase } from '../lib/supabase'

function blankForm() {
  return { name: '', role: '', display_order: '0' }
}

function formFromMember(member) {
  return {
    name:          member.name ?? '',
    role:          member.role ?? '',
    display_order: member.display_order?.toString() ?? '0',
  }
}

export default function TeamModal({ onClose, onSaved, member = null }) {
  const isEdit = member !== null
  const [form, setForm] = useState(isEdit ? formFromMember(member) : blankForm())
  const [photoFile, setPhotoFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      let photo_url = isEdit ? member.photo_url : null

      if (photoFile) {
        const ext = photoFile.name.split('.').pop()
        const filename = `team/${Date.now()}.${ext}`
        const { error: uploadErr } = await supabase.storage
          .from('event-images')
          .upload(filename, photoFile)
        if (uploadErr) throw uploadErr
        const { data: { publicUrl } } = supabase.storage
          .from('event-images')
          .getPublicUrl(filename)
        photo_url = publicUrl
      }

      const payload = {
        name:          form.name,
        role:          form.role,
        photo_url,
        display_order: parseInt(form.display_order) || 0,
      }

      if (isEdit) {
        const { error: updateErr } = await supabase
          .from('team').update(payload).eq('id', member.id)
        if (updateErr) throw updateErr
      } else {
        const { error: insertErr } = await supabase.from('team').insert(payload)
        if (insertErr) throw insertErr
      }

      onSaved()
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

      <div className="relative bg-[#080808] border border-white/10 w-full max-w-md max-h-[90vh] overflow-y-auto">

        <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <p className="font-display text-[10px] tracking-[0.3em] text-accent uppercase mb-1">Admin</p>
            <h2 className="font-serif text-2xl text-secondary">
              {isEdit ? 'Edit Member' : 'Add Member'}
            </h2>
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
            <label className={labelClass}>Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={set('name')}
              placeholder="Jane Smith"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Role</label>
            <input
              type="text"
              required
              value={form.role}
              onChange={set('role')}
              placeholder="Vice President"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Display Order</label>
            <input
              type="number"
              min="0"
              value={form.display_order}
              onChange={set('display_order')}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              Photo{isEdit && member.photo_url ? ' — leave blank to keep existing' : ''}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={e => setPhotoFile(e.target.files[0])}
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
                ? (isEdit ? 'Saving…' : 'Adding…')
                : (isEdit ? 'Save Changes' : 'Add Member')}
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
