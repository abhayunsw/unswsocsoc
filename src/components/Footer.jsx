import { Link } from 'react-router-dom'
import logoWhite from '../assets/logo-transparent-white.png'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">

        {/* Brand */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <img src={logoWhite} alt="Logo" className="h-8 w-8 object-contain" />
            <div>
              <p className="font-display text-xs tracking-[0.3em] text-secondary">SOCRATIC SOCIETY</p>
              <p className="font-sans text-[10px] tracking-[0.25em] text-shade1">UNSW · EST. 2025</p>
            </div>
          </div>
          <p className="font-serif text-shade1 text-sm leading-relaxed max-w-xs">
            An in-person community for those in pursuit of truth and wisdom.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-3">
          <p className="font-display text-xs tracking-[0.25em] text-secondary mb-2">NAVIGATE</p>
          {[['/', 'Home'], ['/events', 'Events'], ['/about', 'About Us']].map(([to, label]) => (
            <Link key={to} to={to} className="font-sans text-xs tracking-widest text-shade1 hover:text-secondary transition-colors uppercase">
              {label}
            </Link>
          ))}
        </div>

        {/* Social */}
        <div className="flex flex-col gap-3">
          <p className="font-display text-xs tracking-[0.25em] text-secondary mb-2">FOLLOW</p>
          <a
            href="https://www.instagram.com/unswsocsoc"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-xs tracking-widest text-shade1 hover:text-secondary transition-colors uppercase"
          >
            Instagram
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61572180609154"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-xs tracking-widest text-shade1 hover:text-secondary transition-colors uppercase"
          >
            Facebook
          </a>
        </div>
      </div>

      <div className="border-t border-white/5 px-6 md:px-12 py-6 flex flex-col md:flex-row justify-between items-center gap-3">
        <p className="font-sans text-[11px] tracking-widest text-shade1 uppercase">
          © {new Date().getFullYear()} Socratic Society UNSW. All rights reserved.
        </p>
        <p className="font-sans text-[11px] tracking-widest text-shade1 uppercase">
          Website by <span className="text-secondary">Abhay Sharma</span> · Digital Content Director
        </p>
      </div>
    </footer>
  )
}
