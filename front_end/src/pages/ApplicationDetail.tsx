import { useParams } from 'react-router-dom'
import { useMockData } from '../services/mockData'
import { useAuthStore } from '../stores/authStore'
import { sendEmail } from '../services/emailService'

export default function ApplicationDetail() {
  const { id } = useParams()
  const { getApplicationById, getJobById, updateApplication } = useMockData()
  const user = useAuthStore(s => s.user)
  const application = id ? getApplicationById(id) : null
  const job = application?.jobId ? getJobById(application.jobId) : undefined

  if (!application) return <div>Introuvable.</div>
  if (user?.role === 'candidat') {
    const isOwner = application.userId ? application.userId === user.id : application.fullName === user.name
    if (!isOwner) return <div>Accès refusé.</div>
  }
  if (user?.role === 'recruteur') {
    const canView = application.jobId && (job?.postedByUserId === user.id)
    if (!canView) return <div>Accès refusé.</div>
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{application.fullName}</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card p-4">
          <div className="text-sm text-gray-500">Poste</div>
          <div className="text-lg">{application.position} {job ? `· (${job.title})` : ''}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-gray-500">Score</div>
          <div className="text-lg">{application.score ?? '—'}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-gray-500">Statut</div>
          <div className="text-lg">{application.status}</div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card p-4">
          <div className="text-sm text-gray-500">Compatibilité</div>
          <div className="text-lg">{application.compatibilityPct != null ? `${application.compatibilityPct}%` : '—'}</div>
        </div>
      </div>

      {user?.role === 'recruteur' && job?.postedByUserId === user.id && (
        <div className="card p-4 flex gap-2">
          <button className="btn" onClick={() => updateApplication(application.id, { status: 'retenue' })}>Accepter</button>
          <button className="btn" onClick={() => updateApplication(application.id, { status: 'rejetée' })}>Refuser</button>
          <button className="btn" onClick={() => sendEmail(`${application.fullName.split(' ').join('.').toLowerCase()}@example.com`, 'Décision candidature', `Votre candidature est ${application.status === 'retenue' ? 'acceptée' : application.status === 'rejetée' ? 'refusée' : 'en cours'}.`)}>Envoyer réponse par email</button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card p-4">
          <h2 className="mb-2 font-medium">Compétences détectées</h2>
          <ul className="flex flex-wrap gap-2">
            {(application.skills ?? []).map(s => (
              <li key={s} className="rounded-full bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200 px-3 py-1 text-xs">{s}</li>
            ))}
          </ul>
        </div>
        <div className="card p-4">
          <h2 className="mb-2 font-medium">Recommandations</h2>
          <ul className="list-disc pl-6 space-y-1">
            {(application.recommendations ?? ['Aucune']).map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card p-4">
        <h2 className="mb-2 font-medium">CV (texte)</h2>
        <pre className="whitespace-pre-wrap text-sm leading-6">{application.cvText}</pre>
      </div>
      {application.coverLetterText && (
        <div className="card p-4">
          <h2 className="mb-2 font-medium">Lettre de motivation</h2>
          <pre className="whitespace-pre-wrap text-sm leading-6">{application.coverLetterText}</pre>
        </div>
      )}
    </div>
  )
}


