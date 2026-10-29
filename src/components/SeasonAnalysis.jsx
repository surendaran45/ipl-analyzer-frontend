import { useState, useEffect } from 'react'
import { getSeasons, getSeasonStats, getTeams } from '../api'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts'

const COLORS = [
  '#378ADD','#1D9E75','#EF9F27','#E24B4A','#9B59B6',
  '#E67E22','#1ABC9C','#E91E63','#00BCD4','#8BC34A'
]

export default function SeasonAnalysis() {
  const [seasons, setSeasons] = useState([])
  const [selected, setSelected] = useState('')
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [teams, setTeams] = useState([])
  const [selectedTeam, setSelectedTeam] = useState('')
  const [teamTrend, setTeamTrend] = useState([])
  const [trendLoading, setTrendLoading] = useState(false)

  useEffect(() => {
    getSeasons().then(r => setSeasons(r.data.seasons))
    getTeams().then(r => setTeams(r.data.teams))
  }, [])

  const loadSeason = async () => {
    if (!selected) return
    setLoading(true)
    const r = await getSeasonStats(selected)
    setStats(r.data)
    setLoading(false)
  }

  const loadTeamTrend = async () => {
    if (!selectedTeam) return
    setTrendLoading(true)
    const results = []
    for (const season of seasons) {
      const r = await getSeasonStats(season)
      const found = r.data.team_wins.find(t => t.team === selectedTeam)
      results.push({
        season,
        wins: found ? found.wins : 0
      })
    }
    setTeamTrend(results)
    setTrendLoading(false)
  }

  return (
    <div className="space-y-4">

      {/* Season breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <p className="text-sm font-medium mb-3">Season breakdown</p>
        <p className="text-sm text-gray-500 mb-2">Select season</p>
        <select
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3"
          value={selected}
          onChange={e => setSelected(e.target.value)}
        >
          <option value="">Choose a season...</option>
          {seasons.map(s => <option key={s}>{s}</option>)}
        </select>
        <button
          onClick={loadSeason}
          className="w-full py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition"
        >
          {loading ? 'Loading...' : 'Get season stats →'}
        </button>
      </div>

      {stats && !loading && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-medium mb-1">IPL {stats.season}</p>
          <p className="text-xs text-gray-500 mb-4">{stats.total_matches} matches played</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={stats.team_wins} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="team" type="category" tick={{ fontSize: 10 }} width={140} />
              <Tooltip />
              <Bar dataKey="wins" radius={[0, 6, 6, 0]}>
                {stats.team_wins.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Team win trend across seasons */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <p className="text-sm font-medium mb-3">Team win trend across seasons</p>
        <p className="text-sm text-gray-500 mb-2">Select team</p>
        <select
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3"
          value={selectedTeam}
          onChange={e => setSelectedTeam(e.target.value)}
        >
          <option value="">Choose a team...</option>
          {teams.map(t => <option key={t}>{t}</option>)}
        </select>
        <button
          onClick={loadTeamTrend}
          className="w-full py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition"
        >
          {trendLoading ? 'Loading...' : 'Show trend →'}
        </button>

        {teamTrend.length > 0 && !trendLoading && (
          <div className="mt-4">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={teamTrend}>
                <XAxis dataKey="season" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="wins"
                  stroke="#378ADD"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#378ADD' }}
                  name="Wins"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

    </div>
  )
}