import { useMemo } from 'react'
import { Bar, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  TimeScale
} from 'chart.js'
import { useMockData } from '../services/mockData'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, TimeScale)

export default function Dashboard() {
  const { applications } = useMockData()

  const stats = useMemo(() => {
    const total = applications.length
    const avgScore = total ? Math.round(applications.reduce((a, c) => a + (c.score ?? 0), 0) / total) : 0
    const byStatus = applications.reduce<Record<string, number>>((acc, a) => {
      acc[a.status] = (acc[a.status] || 0) + 1
      return acc
    }, {})
    const byJob: Record<string, { count: number; avgScore: number }> = {}
    for (const a of applications) {
      const key = a.position
      if (!byJob[key]) byJob[key] = { count: 0, avgScore: 0 }
      byJob[key].count += 1
      byJob[key].avgScore += (a.score ?? 0)
    }
    for (const k of Object.keys(byJob)) {
      byJob[k].avgScore = byJob[k].count ? Math.round(byJob[k].avgScore / byJob[k].count) : 0
    }
    const byDay: Record<string, number> = {}
    for (const a of applications) {
      const d = new Date(a.createdAt)
      const key = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString()
      byDay[key] = (byDay[key] || 0) + 1
    }
    return { total, avgScore, byStatus, byJob, byDay }
  }, [applications])

  const chartData = {
    labels: Object.keys(stats.byStatus),
    datasets: [
      {
        label: 'Candidatures',
        data: Object.values(stats.byStatus),
        backgroundColor: '#0ea5e9'
      }
    ]
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Tableau de bord</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="card p-4">
          <div className="text-sm text-gray-500">Candidatures</div>
          <div className="text-2xl font-semibold">{stats.total}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-gray-500">Score moyen</div>
          <div className="text-2xl font-semibold">{stats.avgScore}</div>
        </div>
        <div className="card p-4">
          <div className="text-sm text-gray-500">Statuts</div>
          <div className="text-2xl font-semibold">{Object.keys(stats.byStatus).length}</div>
        </div>
      </div>

      <div className="card p-4">
        <Bar data={chartData} options={{
          responsive: true,
          plugins: { legend: { display: false }, title: { display: true, text: 'Répartition par statut' } }
        }} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card p-4">
          <h2 className="mb-2 font-medium">Moyenne des scores par poste</h2>
          <Bar data={{
            labels: Object.keys(stats.byJob),
            datasets: [{ label: 'Score moyen', data: Object.values(stats.byJob).map(v => v.avgScore), backgroundColor: '#22d3ee' }]
          }} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
        <div className="card p-4">
          <h2 className="mb-2 font-medium">Candidatures par jour</h2>
          <Line data={{
            labels: Object.keys(stats.byDay).sort(),
            datasets: [{ label: 'Nb', data: Object.keys(stats.byDay).sort().map(k => stats.byDay[k]), borderColor: '#0ea5e9', backgroundColor: 'rgba(14,165,233,0.2)' }]
          }} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
      </div>
    </div>
  )
}


