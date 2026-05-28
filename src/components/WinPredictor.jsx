import { useState, useEffect } from 'react'
import { getTeams, getVenues, getWinProb } from '../api'

export default function WinPredictor() {
  const [teams, setTeams] = useState([])
  const [venues, setVenues] = useState([])
  const [form, setForm] = useState({
    team1: '', team2: '', toss_winner: '', toss_decision: 'bat', venue: '', season: 2023
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getTeams().then(r => setTeams(r.data.teams))
    getVenues().then(r => setVenues(r.data.venues))
  }, [])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const predict = async () => {
    if (!form.team1 || !form.team2 || !form.venue || !form.toss_winner) return
    setLoading(true)
    const r = await getWinProb(form)
    setResult(r.data)
    setLoading(false)
  }

  const probs = result?.probabilities ? Object.entries(result.probabilities) : []

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        {[
          { label: 'Team 1', key: 'team1', opts: teams },
          { label: 'Team 2', key: 'team2', opts: teams },
          { label: 'Toss winner', key: 'toss_winner', opts: teams },
        ].map(({ label, key, opts }) => (
          <div key={key}>
            <p className="text-sm text-gray-500 mb-1">{label}</p>
            <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              value={form[key]} onChange={e => set(key, e.target.value)}>
              <option value="">Choose...</option>
              {opts.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        ))}

        <div>
          <p className="text-sm text-gray-500 mb-1">Toss decision</p>
          <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            value={form.toss_decision} onChange={e => set('toss_decision', e.target.value)}>
            <option value="bat">Bat</option>
            <option value="field">Field</option>
          </select>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">Venue</p>
          <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            value={form.venue} onChange={e => set('venue', e.target.value)}>
            <option value="">Choose...</option>
            {venues.map(v => <option key={v}>{v}</option>)}
          </select>
        </div>

        <button onClick={predict}
          className="w-full py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition mt-2">
          {loading ? 'Predicting...' : 'Predict winner →'}
        </button>
      </div>

      {result && !result.error && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <p className="text-sm font-medium">Predicted winner:
            <span className="ml-2 text-blue-700">{result.predicted_winner}</span>
          </p>
          <div className="space-y-2">
            {probs.map(([team, pct]) => (
              <div key={team}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">{team}</span>
                  <span className="font-medium">{pct}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-blue-500 transition-all duration-500"
                    style={{ width: pct + '%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}