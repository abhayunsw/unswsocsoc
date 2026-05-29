// TeamCard — reads from /src/data/team.js
// No changes needed here when updating team members.

export default function TeamCard({ member }) {
  return (
    <div className="team-card group relative overflow-hidden bg-shade2/20 border border-white/10 transition-all duration-300 hover:border-accent/40">

      {/* Photo / placeholder */}
      <div className="aspect-square relative overflow-hidden bg-shade2/40">
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {/* Elegant initials placeholder */}
            <span className="font-serif text-5xl text-shade1/40 italic select-none">
              {member.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
        )}
        <div className="team-overlay absolute inset-0 bg-accent/10 opacity-0 transition-opacity duration-300" />
      </div>

      {/* Info */}
      <div className="p-5 border-t border-white/10">
        <p className="font-serif text-lg text-secondary">{member.name}</p>
        <p className="font-sans text-[11px] tracking-[0.15em] text-shade1 uppercase mt-1">{member.role}</p>
      </div>
    </div>
  )
}
