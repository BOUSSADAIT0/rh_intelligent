import { useMemo, useState } from 'react'
import { useMockData } from '../services/mockData'
import { useAuthStore } from '../stores/authStore'
import { fileToText } from '../utils/fileToText'
import { useNotificationStore } from '../stores/notificationStore'
import { Link } from 'react-router-dom'

export default function JobBoard() {
  const { jobs, applications, addApplication, analyzeCv } = useMockData()
  const user = useAuthStore(s => s.user)
  const push = useNotificationStore(s => s.push)

  const [selectedJobId, setSelectedJobId] = useState<string>('')
  const [cvText, setCvText] = useState('')
  const [coverLetterText, setCoverLetterText] = useState('')

  const myApplicationsByJob = useMemo(() => {
    if (!user) return {}
    const map: Record<string, { id: string; status: string; createdAt: string }> = {}
    for (const a of applications) {
      if (a.userId === user.id && a.jobId) {
        const prev = map[a.jobId]
        if (!prev || new Date(a.createdAt).getTime() < new Date(prev.createdAt).getTime()) {
          map[a.jobId] = { id: a.id, status: a.status, createdAt: a.createdAt }
        }
      }
    }
    return map
  }, [applications, user])

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await fileToText(file)
    setCvText(text)
  }

  async function handleApply(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !selectedJobId || !cvText) return
    const job = jobs.find(j => j.id === selectedJobId)
    if (!job) return
    const app = addApplication({
      fullName: user.name,
      position: job.title,
      cvText,
      coverLetterText,
      jobId: job.id,
      userId: user.id
    })
    await analyzeCv(app.id)
    push({ type: 'success', message: 'Candidature créée et analysée' })
    setCvText('')
    setCoverLetterText('')
    setSelectedJobId('')
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Postes publiés</h1>

      <div className="grid gap-4 sm:grid-cols-2">
        {jobs.map(job => {
          const myApp = myApplicationsByJob[job.id]
          const isSelected = selectedJobId === job.id
          return (
            <div key={job.id} className="card p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-medium">{job.title}</div>
                  {job.description && (
                    <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">{job.description}</div>
                  )}
                </div>
                {myApp ? (
                  <Link to={`/applications/${myApp.id}`} className="btn">Voir ma candidature ({myApp.status})</Link>
                ) : (
                  <button className="btn" onClick={() => setSelectedJobId(isSelected ? '' : job.id)}>
                    {isSelected ? 'Annuler' : 'Postuler'}
                  </button>
                )}
              </div>

              <div className="text-sm">
                <div className="mb-1"><span className="text-gray-500">Compétences requises:</span> {job.requiredSkills.join(', ') || '—'}</div>
                <div><span className="text-gray-500">Nice-to-have:</span> {(job.niceToHaveSkills ?? []).join(', ') || '—'}</div>
              </div>

              {isSelected && !myApp && (
                <form onSubmit={handleApply} className="grid gap-3 border-t pt-3">
                  <div className="grid gap-2">
                    <label className="text-sm text-gray-600 dark:text-gray-300">CV (texte)</label>
                    <textarea className="min-h-[120px] rounded-md border px-3 py-2 bg-white dark:bg-gray-900" value={cvText} onChange={e => setCvText(e.target.value)} />
                    <input type="file" aria-label="Uploader CV" onChange={handleFileUpload} />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm text-gray-600 dark:text-gray-300">Lettre de motivation (optionnel)</label>
                    <textarea className="min-h-[80px] rounded-md border px-3 py-2 bg-white dark:bg-gray-900" value={coverLetterText} onChange={e => setCoverLetterText(e.target.value)} />
                  </div>
                  <div className="flex gap-2">
                    <button className="btn" type="submit">Confirmer la candidature</button>
                    <button type="button" className="btn" onClick={() => setSelectedJobId('')}>Annuler</button>
                  </div>
                </form>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}


