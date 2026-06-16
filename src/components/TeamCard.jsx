export default function TeamCard({ member, onSelect, onEdit, onDelete }) {
  return (
    <div
      onClick={onSelect}
      className="team-card group relative overflow-hidden bg-shade2/20 border border-white/10 transition-all duration-300 hover:border-accent/40 flex flex-col cursor-pointer"
    >

      {/* Photo / placeholder */}
      <div className="aspect-square relative overflow-hidden bg-shade2/40">
        {member.photo_url ? (
          <img
            src={member.photo_url}
            alt={member.name}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-serif text-5xl text-shade1/40 italic select-none">
              {member.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
        )}
        <div className="team-overlay absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Admin controls — stop propagation so they don't open the profile modal */}
        {(onEdit || onDelete) && (
          <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {onEdit && (
              <button
                onClick={e => { e.stopPropagation(); onEdit() }}
                className="font-sans text-[10px] tracking-widest uppercase text-shade1 hover:text-secondary bg-black/80 border border-white/10 hover:border-secondary/30 px-2.5 py-1 transition-all duration-200"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={e => { e.stopPropagation(); onDelete() }}
                className="font-sans text-[10px] tracking-widest uppercase text-shade1 hover:text-secondary bg-black/80 border border-white/10 hover:border-secondary/30 px-2.5 py-1 transition-all duration-200"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>

      {/* Name, role, degree */}
      <div className="p-5 border-t border-white/10">
        <p className="font-serif text-lg text-secondary">{member.name}</p>
        <p className="font-sans text-[11px] tracking-[0.15em] text-shade1 uppercase mt-1">
          {member.role}
        </p>
        {member.degree && (
          <p className="font-sans text-[11px] text-shade1/50 mt-1 leading-snug">
            {member.degree}
          </p>
        )}
      </div>
    </div>
  )
}
