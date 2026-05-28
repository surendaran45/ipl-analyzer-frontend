import { useState, useEffect } from 'react'
import { getPlayers, getPlayerStats, getPlayerSeasons } from '../api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import AskAI from './AskAI'

export default function PlayerStats() {
  const [players, setPlayers] = useState([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState('')
  const [stats, setStats] = useState(null)
  const [seasons, setSeasons] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getPlayers().then(r => setPlayers(r.data.players))
  }, [])

  const filtered = players.filter(p =>
    p.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 8)

  const load = async (name) => {
    setSelected(name)
    setSearch(name)
    setLoading(true)
    const [statsRes, seasonsRes] = await Promise.all([
      getPlayerStats(name),
      getPlayerSeasons(name)
    ])
    setStats(statsRes.data)
    setSeasons(seasonsRes.data.seasons)
    setLoading(false)
  }

  const aiContext = stats ? `Player: ${stats.player}, Key batting appearances: ${stats.key_batting_appearances}, Key bowling appearances: ${stats.key_bowling_appearances}, Team win % when key batsman: ${stats.batting_win_pct}%, Team win % when key bowler: ${stats.bowling_win_pct}%` : ''

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <p className="text-sm text-gray-500 mb-2">Search player</p>
        <input
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-2"
          placeholder="e.g. Virat Kohli, MS Dhoni..."
          value={search}
          onChange={e => { setSearch(e.target.value); setSelected('') }}
        />
        {search && !selected && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {filtered.length === 0 && (
              <p className="text-sm text-gray-400 p-3">No players found</p>
            )}
            {filtered.map(p => (
              <button
                key={p}
                onClick={() => load(p)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 border-b border-gray-100 last:border-0"
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 text-sm text-gray-400">
          Loading player stats...
        </div>
      )}

      {stats && !loading && (
        <>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Key batting appearances', value: stats.key_batting_appearances },
              { label: 'Key bowling appearances', value: stats.key_bowling_appearances },
              { label: 'Win % as key batsman', value: stats.batting_win_pct + '%' },
              { label: 'Win % as key bowler', value: stats.bowling_win_pct + '%' },
            ].map(m => (
              <div key={m.label} className="bg-white rounded-xl border border-gray-200 p-4">
                <p className="text-2xl font-medium">{m.value}</p>
                <p className="text-xs text-gray-500 mt-1">{m.label}</p>
              </div>
            ))}
          </div>

          {seasons.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-sm font-medium mb-4">Season-wise appearances</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={seasons}>
                  <XAxis dataKey="season" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="batting_appearances" name="Batting" fill="#378ADD" radius={[4,4,0,0]} />
                  <Bar dataKey="bowling_appearances" name="Bowling" fill="#1D9E75" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
              <AskAI
                context={aiContext}
                prompt={`Analyze ${selected}'s IPL impact. How important are they to their team's wins? What does their season trend tell us?`}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}