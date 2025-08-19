import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'

export default function Login() {
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('password')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const login = useAuthStore(s => s.login)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-6 text-2xl font-semibold">Connexion</h1>
      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input className="w-full rounded-md border px-3 py-2 bg-white dark:bg-gray-900" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">Mot de passe</label>
          <input type="password" className="w-full rounded-md border px-3 py-2 bg-white dark:bg-gray-900" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <button className="btn w-full" disabled={loading}>{loading ? 'Connexion...' : 'Se connecter'}</button>
      </form>
    </div>
  )
}


