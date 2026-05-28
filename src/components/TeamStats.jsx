import { useState, useEffect } from 'react'
import { getTeams, getTeamStats } from '../api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import AskAI from './AskAI'

export default function TeamStats() {
  const [teams, setTeams] = useState([])
  const [selected, setSelected] = useState('')
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getTeams().then(r => setTeams(r.data.teams))
  }, [])

  const load = async () => {
    if (!selected) return
    setLoading(true)
    const r = await getTeamStats(selected)
    setStats(r.data)
    setLoading(false)
  }

  const chartData = stats ? [
    { name: 'Wins', value: stats.wins },
    { name: 'Losses', value: stats.total_matches - stats.wins },
  ] : []

  const aiContext = stats ? `Team: ${stats.team}, Total matches: ${stats.total_matches}, Wins: ${stats.wins}, Win rate: ${stats.win_pct}%, Average first innings score: ${stats.avg_first_innings_score}` : ''

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <p className="text-sm text-gray-500 mb-2">Select team</p>
        <select
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3"
          value={selected}
          onChange={e => setSelected(e.target.value)}
        >
          <option value="">Choose a team...</option>
          {teams.map(t => <option key={t}>{t}</option>)}
        </select>
        <button
          onClick={load}
          className="w-full py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition"
        >
          {loading ? 'Loading...' : 'Get stats →'}
        </button>
      </div>

      {stats && (
        <>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Total matches', value: stats.total_matches },
              { label: 'Wins', value: stats.wins },
              { label: 'Win rate', value: stats.win_pct + '%' },
            ].map(m => (
              <div key={m.label} className="bg-white rounded-xl border border-gray-200 p-4">
                <p className="text-2xl font-medium">{m.value}</p>
                <p className="text-xs text-gray-500 mt-1">{m.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm font-medium mb-4">Win / Loss breakdown</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  <Cell fill="#378ADD" />
                  <Cell fill="#E24B4A" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <AskAI
              context={aiContext}
              prompt={`Analyze ${selected}'s overall IPL performance based on this data. What makes them strong or weak? Which eras did they dominate?`}
            />
          </div>
        </>
      )}
    </div>
  )
}