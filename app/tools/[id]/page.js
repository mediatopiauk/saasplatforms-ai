'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ToolDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [tool, setTool] = useState(null)

  useEffect(() => {
    async function fetchTool() {
      const { data } = await supabase.from('tools').select('*').eq('id', params.id).single()
      setTool(data)
    }
    fetchTool()
  }, [params.id])

  if (!tool) return <div className="p-8">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <button onClick={() => router.push('/')} className="mb-4 text-blue-600 hover:underline">
        ← Back to all tools
      </button>
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">{tool.name}</h1>
        <p className="text-gray-600 mb-6">{tool.description}</p>
        <div className="mb-6">
          <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded mr-2">{tool.category}</span>
          <span className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded">{tool.pricing_model}</span>
        </div>
        <p className="text-3xl font-bold text-blue-600 mb-6">{tool.starting_price}</p>
        {tool.features && tool.features.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-3">Features</h2>
            <ul className="space-y-2">
              {tool.features.map((f, i) => <li key={i} className="flex gap-2"><span className="text-green-600">✓</span>{f}</li>)}
            </ul>
          </div>
        )}
        <a href={tool.website_url} target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
          Visit {tool.name}
        </a>
      </div>
    </div>
  )
}
