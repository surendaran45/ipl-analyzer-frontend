import { useState, useEffect } from 'react'
import { getTeams, getH2H } from '../api'
import AskAI from './AskAI'

export default function HeadToHead() {
  const [teams, setTeams] = useState([])
  const [t1, setT1] = useState('')
  const [t2, setT2] = useState('')
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getTeams().then(r => setTeams(r.data.teams))
  }, [])

  const load = async () => {
    if (!t1 || !t2 || t1 === t2) return
    setLoading(true)
    const r = await getH2H(t1, t2)
    setStats(r.data)
    setLoading(false)
  }

  const aiContext = stats ? `${stats.team1} vs ${stats.team2}: Total matches: ${stats.total_matches}, ${stats.team1} wins: ${stats.team1_wins} (${stats.team1_win_pct}%), ${stats.team2} wins: ${stats.team2_wins} (${stats.team2_win_pct}%)` : ''

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <p className="text-sm text-gray-500 mb-2">Team 1</p>
        <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3"
          value={t1} onChange={e => setT1(e.target.value)}>
          <option value="">Choose...</option>
          {teams.map(t => <option key={t}>{t}</option>)}
        </select>
        <p className="text-sm text-gray-500 mb-2">Team 2</p>
        <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3"
          value={t2} onChange={e => setT2(e.target.value)}>
          <option value="">Choose...</option>
          {teams.map(t => <option key={t}>{t}</option>)}
        </select>
        <button onClick={load}
          className="w-full py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition">
          {loading ? 'Loading...' : 'Compare →'}
        </button>
      </div>

      {stats && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <p className="text-sm font-medium">{stats.team1} vs {stats.team2}</p>
          <p className="text-xs text-gray-500">{stats.total_matches} matches played</p>

          <div className="space-y-2">
            {[
              { label: stats.team1, wins: stats.team1_wins, pct: stats.team1_win_pct, color: '#378ADD' },
              { label: stats.team2, wins: stats.team2_wins, pct: stats.team2_win_pct, color: '#1D9E75' },
            ].map(row => (
              <div key={row.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">{row.label}</span>
                  <span className="font-medium">{row.wins} wins ({row.pct}%)</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width: row.pct + '%', background: row.color }} />
                </div>
              </div>
            ))}
          </div>

          <AskAI
            context={aiContext}
            prompt={`Analyze this IPL rivalry between ${t1} and ${t2}. Who dominates and why? What are the key factors behind the win difference?`}
          />
        </div>
      )}
    </div>
  )
}