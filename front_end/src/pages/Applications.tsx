import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useMockData } from '../services/mockData'
import { sendEmail } from '../services/emailService'
import { useNotificationStore } from '../stores/notificationStore'
import { fileToText } from '../utils/fileToText'

export default function Applications() {
  const { applications, addApplication, removeApplication, analyzeCv, jobs } = useMockData()
  const [fullName, setFullName] = useState('')
  const [position, setPosition] = useState('Développeur Full-Stack')
  const [jobId, setJobId] = useState<string>('')
  const [cvText, setCvText] = useState('')
  const [coverLetterText, setCoverLetterText] = useState('')
  const push = useNotificationStore(s => s.push)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [jobFilter, setJobFilter] = useState<string>('')
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<'compat' | 'score' | 'date'>('compat')

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!fullName || !cvText) return
    const app = addApplication({ fullName, position, cvText, coverLetterText, jobId: jobId || undefined })
    await analyzeCv(app.id)
    push({ type: 'success', message: "Analyse IA terminée" })
    setFullName('')
    setCvText('')
    setCoverLetterText('')
  }

  async function handleCvUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await fileToText(file)
    setCvText(text)
    push({ type: 'info', message: 'CV importé' })
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await fileToText(file)
    setCoverLetterText(text)
    push({ type: 'info', message: 'Lettre importée' })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <h1 className="text-2xl font-semibold">Candidatures</h1>
        <div className="text-sm text-gray-600 dark:text-gray-300">Total: {applications.length}</div>
      </div>
      <form onSubmit={handleAdd} className="card p-4 grid gap-3" aria-label="Créer une candidature">
        <div className="grid gap-3 sm:grid-cols-3">
          <input placeholder="Nom complet" className="rounded-md border px-3 py-2 bg-white dark:bg-gray-900" value={fullName} onChange={e => setFullName(e.target.value)} />
          <input placeholder="Poste visé" className="rounded-md border px-3 py-2 bg-white dark:bg-gray-900" value={position} onChange={e => setPosition(e.target.value)} />
          <select className="rounded-md border px-3 py-2 bg-white dark:bg-gray-900" value={jobId} onChange={e => setJobId(e.target.value)}>
            <option value="">Associer à un poste…</option>
            {jobs.map(j => (
              <option key={j.id} value={j.id}>{j.title}</option>
            ))}
          </select>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="grid gap-2">
            <textarea placeholder="Collez le CV (texte)" className="min-h-[120px] rounded-md border px-3 py-2 bg-white dark:bg-gray-900" value={cvText} onChange={e => setCvText(e.target.value)} />
            <input type="file" aria-label="Uploader CV" onChange={handleCvUpload} />
          </div>
          <div className="grid gap-2">
            <textarea placeholder="Collez la lettre de motivation (optionnel)" className="min-h-[120px] rounded-md border px-3 py-2 bg-white dark:bg-gray-900" value={coverLetterText} onChange={e => setCoverLetterText(e.target.value)} />
            <input type="file" aria-label="Uploader lettre" onChange={handleCoverUpload} />
          </div>
        </div>
        <button className="btn justify-self-start">Ajouter + Analyser</button>
      </form>

      <div className="card p-3 grid gap-3 sm:grid-cols-4 items-end" aria-label="Filtres des candidatures">
        <input placeholder="Rechercher (nom, poste)" className="rounded-md border px-3 py-2 bg-white dark:bg-gray-900" value={search} onChange={e => setSearch(e.target.value)} />
        <select className="rounded-md border px-3 py-2 bg-white dark:bg-gray-900" value={jobFilter} onChange={e => setJobFilter(e.target.value)}>
          <option value="">Tous les postes</option>
          {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
        </select>
        <select className="rounded-md border px-3 py-2 bg-white dark:bg-gray-900" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">Tous statuts</option>
          <option value="nouvelle">Nouvelle</option>
          <option value="analysée">Analysée</option>
          <option value="retenue">Retenue</option>
          <option value="rejetée">Rejetée</option>
        </select>
        <select className="rounded-md border px-3 py-2 bg-white dark:bg-gray-900" value={sortKey} onChange={e => setSortKey(e.target.value as any)}>
          <option value="compat">Tri: Compatibilité ↓</option>
          <option value="score">Tri: Score ↓</option>
          <option value="date">Tri: Date ↓</option>
        </select>
      </div>

      <div className="card">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="p-3">Candidat</th>
              <th className="p-3">Poste</th>
              <th className="p-3">Score</th>
              <th className="p-3">Compatibilité</th>
              <th className="p-3">Statut</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {[...applications]
              .filter(a => (jobFilter ? a.jobId === jobFilter : true))
              .filter(a => (statusFilter ? a.status === statusFilter : true))
              .filter(a => (search ? (a.fullName.toLowerCase().includes(search.toLowerCase()) || a.position.toLowerCase().includes(search.toLowerCase())) : true))
              .sort((a, b) => {
                if (sortKey === 'score') return (b.score ?? -1) - (a.score ?? -1) || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                if (sortKey === 'date') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                return (b.compatibilityPct ?? -1) - (a.compatibilityPct ?? -1) || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              })
              .map(a => (
              <tr key={a.id} className="border-t">
                <td className="p-3"><Link className="text-primary" to={`/applications/${a.id}`}>{a.fullName}</Link></td>
                <td className="p-3">{a.position}</td>
                <td className="p-3">{a.score ?? '—'}</td>
                <td className="p-3">{a.compatibilityPct != null ? `${a.compatibilityPct}%` : '—'}</td>
                <td className="p-3">{a.status}</td>
                <td className="p-3 text-right flex gap-2 justify-end">
                  <button className="btn" onClick={() => removeApplication(a.id)}>Supprimer</button>
                  <button className="btn" onClick={() => sendEmail(`${a.fullName.split(' ').join('.').toLowerCase()}@example.com`, `Statut candidature: ${a.status}`, `Score: ${a.score ?? 'NA'}`)}>Email</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


