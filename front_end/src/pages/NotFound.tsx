import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="text-center space-y-4">
      <h1 className="text-3xl font-semibold">404</h1>
      <p>Page introuvable.</p>
      <Link to="/" className="btn">Retour</Link>
    </div>
  )
}


