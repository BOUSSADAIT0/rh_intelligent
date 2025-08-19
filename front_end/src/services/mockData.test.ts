import { describe, it, expect } from 'vitest'
import { useMockData } from './mockData'

describe('mockData store', () => {
  it('adds application and computes score on analyze', async () => {
    const { addApplication, analyzeCv, getApplicationById, jobs } = useMockData.getState()
    const app = addApplication({ fullName: 'Test', position: 'Développeur Frontend', cvText: 'React TypeScript', jobId: jobs[0]?.id })
    await analyzeCv(app.id)
    const updated = getApplicationById(app.id)!
    expect(updated.score).toBeGreaterThanOrEqual(0)
    expect(updated.status).toBe('analysée')
  })
})


