'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase, Tool } from '@/lib/supabase'
import { ArrowLeft, ExternalLink, Star, Check } from 'lucide-react'

export default function ToolDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [tool, setTool] = useState<Tool | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTool()
  }, [params.id])

  async function fetchTool() {
    try {
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error
      setTool(data)
    } catch (error) {
      console.error('Error fetching tool:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!tool) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Tool not found</h1>
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-700"
          >
            ← Back to home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
        <div className="max-w-5xl mx-auto px-4">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all tools
          </button>
          
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-white rounded-xl flex items-center justify-center text-4xl font-bold text-gray-400 flex-shrink-0">
              {tool.name.charAt(0)}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold">{tool.name}</h1>
                {tool.featured && (
                  <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                )}
              </div>
              <p className="text-xl text-blue-100 mb-4">{tool.description}</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-medium">
                  {tool.category}
                </span>
                <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-medium">
                  {tool.pricing_model}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Pricing</h2>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-900">{tool.starting_price}</span>
                <span className="text-gray-600">starting price</span>
              </div>
              <p className="text-gray-600 mt-2">{tool.pricing_model} pricing model</p>
            </div>

            {tool.features && tool.features.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Features</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {tool.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {tool.integrations && tool.integrations.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Integrations</h2>
                <div className="flex flex-wrap gap-2">
                  {tool.integrations.map((integration, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {integration}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-4">
              
                href={tool.affiliate_link || tool.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold mb-4"
              >
                Visit {tool.name}
                <ExternalLink className="w-5 h-5" />
              </a>
              
              
                href={tool.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 hover:text-gray-900 block text-center"
              >
                {tool.website_url}
              </a>

              <div className="mt-6 pt-6 border-t">
                <h3 className="font-semibold text-gray-900 mb-2">Category</h3>
                <p className="text-gray-600 capitalize">{tool.category.replace('-', ' ')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
