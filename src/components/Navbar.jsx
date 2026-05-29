import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logoWhite from '../assets/logo-transparent-white.png'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [location])

  const links = [
    { to: '/',       label: 'Home'   },
    { to: '/events', label: 'Events' },
    { to: '/about',  label: 'About'  },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-black/90 backdrop-blur-sm border-b border-white/5' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={logoWhite}
            alt="Socratic Society UNSW"
            className="h-10 w-10 object-contain"
          />
          <div className="hidden sm:block">
            <p className="font-display text-xs tracking-[0.3em] text-secondary leading-tight">SOCRATIC SOCIETY</p>
            <p className="font-sans text-[10px] tracking-[0.25em] text-shade1 leading-tight">UNSW</p>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-10">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`nav-link font-sans text-xs tracking-[0.2em] uppercase transition-colors ${
                location.pathname === to ? 'text-secondary' : 'text-shade1 hover:text-secondary'
              }`}
            >
              {label}
            </Link>
          ))}
          <a
            href="https://www.instagram.com/unswsocsoc"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-xs tracking-[0.2em] uppercase text-shade1 hover:text-secondary transition-colors nav-link"
          >
            Instagram
          </a>
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-px bg-secondary transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-4 h-px bg-secondary transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-px bg-secondary transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-400 overflow-hidden ${menuOpen ? 'max-h-64' : 'max-h-0'}`}>
        <div className="bg-black/95 backdrop-blur-sm border-t border-white/5 px-6 pb-6 pt-4 flex flex-col gap-5">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="font-sans text-sm tracking-[0.2em] uppercase text-shade1 hover:text-secondary transition-colors"
            >
              {label}
            </Link>
          ))}
          <a
            href="https://www.instagram.com/unswsocsoc"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-sm tracking-[0.2em] uppercase text-shade1 hover:text-secondary transition-colors"
          >
            Instagram
          </a>
        </div>
      </div>
    </nav>
  )
}
