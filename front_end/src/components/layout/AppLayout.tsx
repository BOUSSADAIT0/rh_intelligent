import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { Toaster } from '../ui/Toaster'

export function AppLayout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b bg-white/70 backdrop-blur dark:bg-gray-900/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/" className="font-semibold tracking-tight">
            RH Intelligent
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'text-primary' : ''}>Tableau de bord</NavLink>
            {user && (
              <>
                <NavLink to="/applications" className={({ isActive }) => isActive ? 'text-primary' : ''}>Candidatures</NavLink>
                {(user.role === 'admin' || user.role === 'recruteur') && (
                  <NavLink to="/jobs" className={({ isActive }) => isActive ? 'text-primary' : ''}>Postes</NavLink>
                )}
                {user.role === 'admin' && (
                  <NavLink to="/users" className={({ isActive }) => isActive ? 'text-primary' : ''}>Utilisateurs</NavLink>
                )}
              </>
            )}
          </nav>
          <div className="flex items-center gap-3 text-sm">
            {user ? (
              <>
                <span className="hidden sm:inline text-gray-600 dark:text-gray-300">{user.name} · {user.role}</span>
                <button className="btn" onClick={handleLogout}>Déconnexion</button>
              </>
            ) : (
              <Link className="btn" to="/login">Connexion</Link>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>
      <Toaster />
    </div>
  )
}


