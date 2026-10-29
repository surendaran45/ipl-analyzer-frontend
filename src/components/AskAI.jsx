import { API_BASE } from '../api'
import { useState } from 'react'

export default function AskAI({ context, prompt }) {
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const ask = async () => {
    setOpen(true)
    setLoading(true)
    setResponse('')

    const fullPrompt = `You are an expert IPL cricket analyst. Here is real data from the IPL Analyzer app:\n\n${context}\n\n${prompt}\n\nGive a sharp, specific, 4-6 sentence analysis based on this data. Be direct and insightful.`

    try {
      const res = await fetch(`${API_BASE}/ask-ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt })
      })
      const data = await res.json()
      setResponse(data.result || 'Could not get analysis.')
    } catch {
      setResponse('Error connecting to backend. Make sure uvicorn is running.')
    }

    setLoading(false)
  }

  return (
    <div className="mt-3">
      <button
        onClick={ask}
        className="w-full py-2 text-sm border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 transition"
      >
        ✨ Ask AI to analyze this
      </button>

      {open && (
        <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-xs font-medium text-blue-700 mb-2">AI Analysis</p>
          {loading ? (
            <p className="text-sm text-blue-400 italic">Analyzing...</p>
          ) : (
            <p className="text-sm text-gray-700 leading-relaxed">{response}</p>
          )}
        </div>
      )}
    </div>
  )
}