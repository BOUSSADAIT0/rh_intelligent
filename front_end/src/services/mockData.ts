import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ApplicationStatus = 'nouvelle' | 'analysée' | 'retenue' | 'rejetée'

export interface JobItem {
  id: string
  title: string
  requiredSkills: string[]
  niceToHaveSkills?: string[]
  description?: string
  postedByUserId?: string
}

export interface ApplicationItem {
  id: string
  fullName: string
  position: string
  cvText: string
  coverLetterText?: string
  score?: number
  status: ApplicationStatus
  skills?: string[]
  recommendations?: string[]
  jobId?: string
  compatibilityPct?: number
  userId?: string
  createdAt: string
}

export interface SimpleUser {
  id: string
  name: string
  email: string
  role: 'admin' | 'recruteur' | 'candidat'
}

interface MockState {
  users: SimpleUser[]
  applications: ApplicationItem[]
  jobs: JobItem[]
  addUser: (u: Omit<SimpleUser, 'id'>) => void
  updateUser: (id: string, changes: Partial<SimpleUser>) => void
  removeUser: (id: string) => void

  addApplication: (a: Omit<ApplicationItem, 'id' | 'status' >) => ApplicationItem
  removeApplication: (id: string) => void
  getApplicationById: (id: string) => ApplicationItem | undefined
  updateApplication: (id: string, changes: Partial<ApplicationItem>) => void

  analyzeCv: (id: string) => Promise<void>

  addJob: (j: Omit<JobItem, 'id'>) => void
  updateJob: (id: string, changes: Partial<JobItem>) => void
  removeJob: (id: string) => void
  getJobById: (id: string) => JobItem | undefined
}

function extractSkills(text: string): string[] {
  const skillList = ['JavaScript', 'TypeScript', 'React', 'Node', 'Python', 'Django', 'SQL', 'AWS', 'Docker']
  const lower = text.toLowerCase()
  return skillList.filter(s => lower.includes(s.toLowerCase()))
}

function computeCompatibilityPct(text: string, job: JobItem | undefined): number | undefined {
  if (!job) return undefined
  const detected = extractSkills(text).map(s => s.toLowerCase())
  const required = job.requiredSkills.map(s => s.toLowerCase())
  if (required.length === 0) return 0
  const matched = required.filter(s => detected.includes(s)).length
  return Math.round((matched / required.length) * 100)
}

function computeScore(text: string, job: JobItem | undefined, positionFallback: string): number {
  const detectedSkills = extractSkills(text)
  const seniorityBoost = /senior|5\+|ancien/.test(text.toLowerCase()) ? 15 : 0

  if (job) {
    const required = job.requiredSkills.map(s => s.toLowerCase())
    const nice = (job.niceToHaveSkills ?? []).map(s => s.toLowerCase())
    const detectedLower = detectedSkills.map(s => s.toLowerCase())

    const requiredMatched = required.filter(s => detectedLower.includes(s)).length
    const niceMatched = nice.filter(s => detectedLower.includes(s)).length

    const requiredCoverage = required.length ? requiredMatched / required.length : 0
    const niceCoverage = nice.length ? niceMatched / Math.max(3, nice.length) : 0

    const skillScore = Math.round(70 * requiredCoverage + 15 * Math.min(1, niceCoverage))
    return Math.min(100, skillScore + seniorityBoost)
  }

  // Fallback si pas de poste associé
  const match = detectedSkills.length * 10
  const positionBoost = text.toLowerCase().includes(positionFallback.toLowerCase()) ? 10 : 0
  return Math.min(100, match + seniorityBoost + positionBoost)
}

export const useMockData = create<MockState>()(persist((set, get) => ({
  users: [
    { id: 'u1', name: 'Admin', email: 'admin@example.com', role: 'admin' },
    { id: 'u2', name: 'Sam Recruteur', email: 'sam@rh.com', role: 'recruteur' },
  ],
  jobs: [
    { id: 'j1', title: 'Développeur Frontend', requiredSkills: ['React', 'TypeScript'], niceToHaveSkills: ['Node', 'AWS'], description: 'Construire des interfaces modernes.', postedByUserId: 'u2' },
    { id: 'j2', title: 'Data Engineer', requiredSkills: ['Python', 'SQL', 'Docker'], niceToHaveSkills: ['AWS'], description: 'Pipelines de données et ETL.', postedByUserId: 'u2' },
  ],
  applications: [
    { id: 'a1', fullName: 'Jane Doe', position: 'Développeur Frontend', jobId: 'j1', cvText: 'React, TypeScript, 5+ ans', coverLetterText: 'Passionnée par le front...', status: 'analysée', score: 85, skills: ['React', 'TypeScript'], recommendations: ['Avancer à entretien'], compatibilityPct: 100, createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
    { id: 'a2', fullName: 'John Smith', position: 'Data Engineer', jobId: 'j2', cvText: 'Python, SQL, Docker', coverLetterText: 'Motivé par la data...', status: 'analysée', score: 70, skills: ['Python', 'SQL', 'Docker'], recommendations: ['Test technique requis'], compatibilityPct: 100, createdAt: new Date(Date.now() - 1000 * 30).toISOString() },
  ],

  addUser: (u) => set(state => ({ users: [{ id: crypto.randomUUID(), ...u }, ...state.users] })),
  updateUser: (id, changes) => set(state => ({ users: state.users.map(u => u.id === id ? { ...u, ...changes } : u) })),
  removeUser: (id) => set(state => ({ users: state.users.filter(u => u.id !== id) })),

  addApplication: (a) => {
    const job = a.jobId ? get().jobs.find(j => j.id === a.jobId) : undefined
    const position = job ? job.title : a.position
    const newItem: ApplicationItem = { id: crypto.randomUUID(), status: 'nouvelle', ...a, position, createdAt: new Date().toISOString() }
    set(state => ({ applications: [newItem, ...state.applications] }))
    return newItem
  },
  removeApplication: (id) => set(state => ({ applications: state.applications.filter(a => a.id !== id) })),
  getApplicationById: (id) => get().applications.find(a => a.id === id),
  updateApplication: (id, changes) => set(state => ({ applications: state.applications.map(a => a.id === id ? { ...a, ...changes } : a) })),

  analyzeCv: async (id) => {
    await new Promise(r => setTimeout(r, 600))
    set(state => ({
      applications: state.applications.map(a => {
        if (a.id !== id) return a
        const job = a.jobId ? get().jobs.find(j => j.id === a.jobId) : undefined
        const score = computeScore(a.cvText, job, a.position)
        const skills = extractSkills(a.cvText)
        const compatibilityPct = computeCompatibilityPct(a.cvText, job)
        const recommendations = score >= 80 ? ['Avancer à entretien'] : score >= 60 ? ['Test technique requis'] : ['Profil peu pertinent']
        return { ...a, status: 'analysée', score, skills, recommendations, compatibilityPct }
      })
    }))
  },

  addJob: (j) => set(state => ({ jobs: [{ id: crypto.randomUUID(), ...j }, ...state.jobs] })),
  updateJob: (id, changes) => set(state => ({ jobs: state.jobs.map(job => job.id === id ? { ...job, ...changes } : job) })),
  removeJob: (id) => set(state => ({ jobs: state.jobs.filter(j => j.id !== id), applications: state.applications.map(a => a.jobId === id ? { ...a, jobId: undefined } : a) })),
  getJobById: (id) => get().jobs.find(j => j.id === id)
}), { name: 'mock-data-store', partialize: (state) => ({ users: state.users, applications: state.applications, jobs: state.jobs }) }))


