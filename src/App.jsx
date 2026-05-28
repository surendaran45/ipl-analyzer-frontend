import { useState } from 'react'
import TeamStats from './components/TeamStats'
import HeadToHead from './components/HeadToHead'
import WinPredictor from './components/WinPredictor'
import PlayerStats from './components/PlayerStats'
import SeasonAnalysis from './components/SeasonAnalysis'

const tabs = ['Team Stats', 'Head to Head', 'Win Predictor', 'Player Stats', 'Season Analysis']

export default function App() {
  const [tab, setTab] = useState(0)

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <span className="text-xl font-semibold">🏏 IPL Analyzer</span>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full ml-auto">2008–2023</span>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6 flex-wrap">
          {tabs.map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(i)}
              className={`px-4 py-2 rounded-lg text-sm border transition-all ${
                tab === i
                  ? 'bg-white border-gray-300 font-medium shadow-sm'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 0 && <TeamStats />}
        {tab === 1 && <HeadToHead />}
        {tab === 2 && <WinPredictor />}
        {tab === 3 && <PlayerStats />}
        {tab === 4 && <SeasonAnalysis />}
      </div>
    </div>
  )
}