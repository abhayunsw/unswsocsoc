import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error: err } = await signIn(email, password)
    setLoading(false)
    if (err) {
      setError(err.message)
    } else {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="w-full max-w-sm">
        <p className="font-display text-[11px] tracking-[0.35em] text-accent uppercase mb-3">
          Admin
        </p>
        <h1 className="font-serif text-4xl text-secondary mb-10">Sign In</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="font-sans text-[11px] tracking-[0.2em] text-shade1 uppercase block mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full bg-transparent border border-white/20 px-4 py-3 text-secondary font-serif text-base focus:outline-none focus:border-white/50 transition-colors"
            />
          </div>

          <div>
            <label className="font-sans text-[11px] tracking-[0.2em] text-shade1 uppercase block mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full bg-transparent border border-white/20 px-4 py-3 text-secondary font-serif text-base focus:outline-none focus:border-white/50 transition-colors"
            />
          </div>

          {error && (
            <p className="font-sans text-xs text-red-400 tracking-wide">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="font-sans text-xs tracking-[0.25em] uppercase text-primary bg-secondary hover:bg-secondary/90 px-8 py-3.5 transition-all duration-300 disabled:opacity-50 mt-2"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
