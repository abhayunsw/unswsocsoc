export default function TeamMemberModal({ member, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-[#080808] border border-white/10 w-full max-w-md max-h-[90vh] overflow-y-auto">

        {/* Photo / initials banner */}
        <div className="relative h-56 overflow-hidden bg-shade2/40">
          {member.photo_url ? (
            <img
              src={member.photo_url}
              alt={member.name}
              className="w-full h-full object-cover object-top"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-serif text-8xl text-shade1/20 italic select-none">
                {member.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-[#080808] via-black/30 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-shade1 hover:text-secondary transition-colors font-sans text-xl leading-none bg-black/60 px-2 py-0.5 border border-white/10"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="px-8 pb-8 -mt-2 flex flex-col gap-6">

          {/* Name + role + degree */}
          <div>
            <h2 className="font-serif text-3xl text-secondary">{member.name}</h2>
            <p className="font-display text-[11px] tracking-[0.3em] text-accent uppercase mt-2">
              {member.role}
            </p>
            {member.degree && (
              <p className="font-sans text-xs text-shade1/60 mt-2 tracking-wide">
                {member.degree}
              </p>
            )}
          </div>

          {/* Favourite philosopher */}
          {member.fav_philosophy && (
            <div className="border-t border-white/10 pt-6">
              <p className="font-sans text-[10px] tracking-[0.3em] text-shade1 uppercase mb-2">
                Favourite Philosopher
              </p>
              <p className="font-serif text-lg text-secondary">
                {member.fav_philosophy}
              </p>
            </div>
          )}

          {/* Bio */}
          {member.why_exec && (
            <div className="border-t border-white/10 pt-6">
              <p className="font-sans text-[10px] tracking-[0.3em] text-shade1 uppercase mb-3">
                Why I Joined Exec
              </p>
              <p className="font-serif text-base text-secondary/80 leading-relaxed italic">
                "{member.why_exec}"
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
