import { useState } from 'react'
import { useMockData } from '../services/mockData'

export default function Users() {
  const { users, addUser, updateUser, removeUser } = useMockData()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'admin' | 'recruteur' | 'candidat'>('recruteur')

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !email) return
    addUser({ name, email, role })
    setName('')
    setEmail('')
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Utilisateurs</h1>
      <form onSubmit={handleAdd} className="card p-4 grid gap-3 sm:grid-cols-4">
        <input placeholder="Nom" className="rounded-md border px-3 py-2 bg-white dark:bg-gray-900" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Email" className="rounded-md border px-3 py-2 bg-white dark:bg-gray-900" value={email} onChange={e => setEmail(e.target.value)} />
        <select className="rounded-md border px-3 py-2 bg-white dark:bg-gray-900" value={role} onChange={e => setRole(e.target.value as any)}>
          <option value="admin">Admin</option>
          <option value="recruteur">Recruteur</option>
          <option value="candidat">Candidat</option>
        </select>
        <button className="btn">Ajouter</button>
      </form>

      <div className="card">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="p-3">Nom</th>
              <th className="p-3">Email</th>
              <th className="p-3">Rôle</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-t">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">
                  <select className="rounded-md border px-2 py-1 bg-white dark:bg-gray-900" value={u.role} onChange={e => updateUser(u.id, { role: e.target.value as any })}>
                    <option value="admin">Admin</option>
                    <option value="recruteur">Recruteur</option>
                    <option value="candidat">Candidat</option>
                  </select>
                </td>
                <td className="p-3 text-right">
                  <button className="btn" onClick={() => removeUser(u.id)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


