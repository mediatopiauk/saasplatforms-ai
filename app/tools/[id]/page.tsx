'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase, Tool } from '@/lib/supabase'

export default function ToolDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [tool, setTool] = useState<Tool | null>(null)

  useEffect(() => {
    async function fetchTool() {
      const { data } = await supabase.from('tools').select('*').eq('id', params.id).single()
      setTool(data)
    }
    fetchTool()
  }, [params.id])

  if (!tool) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <button onClick={() => router.push('/')} className="text-white/80 hover:text-white mb-4">
            ← Back to all tools
          </button>
          <h1 className="text-5xl font-bold mb-4">{tool.name}</h1>
          <p className="text-xl mb-4">{tool.description}</p>
          <div className="flex gap-3">
            <span className="px-4 py-2 bg-white/20 rounded-full">{tool.category}</span>
            <span className="px-4 py-2 bg-white/20 rounded-full">{tool.pricing_model}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">Pricing</h2>
              <p className="text-4xl font-bold text-blue-600 mb-2">{tool.starting_price}</p>
              <p className="text-gray-600">{tool.pricing_model} pricing model</p>
            </div>

            {tool.features && tool.features.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-4">Key Features</h2>
                <ul className="space-y-2">
                  {tool.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {tool.integrations && tool.integrations.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-4">Integrations</h2>
                <div className="flex flex-wrap gap-2">
                  {tool.integrations.map((integration, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                      {integration}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              
                href={tool.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold mb-4"
              >
                Visit {tool.name}
              </a>
              <p className="text-sm text-gray-500 text-center break-all">{tool.website_url}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
