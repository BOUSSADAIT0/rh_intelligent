import { useState } from 'react'
import { useMockData } from '../services/mockData'

export default function Jobs() {
  const { jobs, addJob, removeJob, updateJob } = useMockData()
  const [title, setTitle] = useState('Développeur Frontend')
  const [required, setRequired] = useState('React, TypeScript')
  const [nice, setNice] = useState('Node, AWS')
  const [description, setDescription] = useState('')

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const requiredSkills = required.split(',').map(s => s.trim()).filter(Boolean)
    const niceToHaveSkills = nice.split(',').map(s => s.trim()).filter(Boolean)
    addJob({ title, requiredSkills, niceToHaveSkills, description })
    setTitle('')
    setRequired('')
    setNice('')
    setDescription('')
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Postes</h1>

      <form onSubmit={handleAdd} className="card p-4 grid gap-3">
        <input className="rounded-md border px-3 py-2 bg-white dark:bg-gray-900" placeholder="Titre" value={title} onChange={e => setTitle(e.target.value)} />
        <input className="rounded-md border px-3 py-2 bg-white dark:bg-gray-900" placeholder="Compétences requises (séparées par virgule)" value={required} onChange={e => setRequired(e.target.value)} />
        <input className="rounded-md border px-3 py-2 bg-white dark:bg-gray-900" placeholder="Nice-to-have (séparées par virgule)" value={nice} onChange={e => setNice(e.target.value)} />
        <textarea className="rounded-md border px-3 py-2 bg-white dark:bg-gray-900" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <button className="btn justify-self-start">Ajouter</button>
      </form>

      <div className="card">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="p-3">Titre</th>
              <th className="p-3">Requis</th>
              <th className="p-3">Nice</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(j => (
              <tr key={j.id} className="border-t">
                <td className="p-3">{j.title}</td>
                <td className="p-3">
                  <input className="rounded-md border px-2 py-1 bg-white dark:bg-gray-900 w-full" value={j.requiredSkills.join(', ')} onChange={e => updateJob(j.id, { requiredSkills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
                </td>
                <td className="p-3">
                  <input className="rounded-md border px-2 py-1 bg-white dark:bg-gray-900 w-full" value={(j.niceToHaveSkills ?? []).join(', ')} onChange={e => updateJob(j.id, { niceToHaveSkills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
                </td>
                <td className="p-3 text-right">
                  <button className="btn" onClick={() => removeJob(j.id)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


