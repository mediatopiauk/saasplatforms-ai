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

  if (!tool) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => router.push('/')} className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2">
            <span>←</span> Back to all tools
          </button>
          <a href={tool.website_url} target="_blank" rel="noopener noreferrer" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
            Visit Website
          </a>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex items-start gap-8">
            <div className="w-32 h-32 bg-white rounded-2xl shadow-xl flex items-center justify-center flex-shrink-0">
              <span className="text-6xl font-bold text-gray-700">{tool.name.charAt(0)}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-5xl font-bold">{tool.name}</h1>
                {tool.featured && (
                  <span className="px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-sm font-bold">Featured</span>
                )}
              </div>
              <p className="text-2xl text-blue-100 mb-6">{tool.description}</p>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <span className="text-yellow-300">★★★★★</span>
                  <span className="font-semibold">4.5</span>
                  <span className="text-blue-200">(127 reviews)</span>
                </div>
                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg font-medium capitalize">
                  {tool.category.replace('-', ' ')}
                </span>
                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg font-medium">
                  {tool.pricing_model}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Overview */}
            <div className="bg-white rounded-xl shadow-sm border p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Overview</h2>
              <p className="text-gray-700 text-lg leading-relaxed">{tool.description}</p>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-xl shadow-sm border p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Pricing</h2>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-5xl font-bold text-blue-600">{tool.starting_price}</span>
                  <span className="text-gray-600 text-xl">starting price</span>
                </div>
                <p className="text-gray-600 text-lg">{tool.pricing_model} pricing model</p>
              </div>
            </div>

            {/* Key Features */}
            {tool.features && tool.features.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Key Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tool.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                      <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-800 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Integrations */}
            {tool.integrations && tool.integrations.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Integrations</h2>
                <div className="flex flex-wrap gap-3">
                  {tool.integrations.map((integration, i) => (
                    <span key={i} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium border border-gray-300 transition-colors">
                      {integration}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              
              {/* CTA Card */}
              <div className="bg-white rounded-xl shadow-lg border-2 border-blue-100 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Get Started</h3>
                
                  href={tool.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-bold text-lg shadow-lg hover:shadow-xl transition-all mb-3"
                >
                  Visit {tool.name}
                </a>
                <p className="text-sm text-gray-500 text-center break-all">{tool.website_url}</p>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-600">Category</span>
                    <span className="font-semibold text-gray-900 capitalize">{tool.category.replace('-', ' ')}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-gray-600">Pricing</span>
                    <span className="font-semibold text-gray-900">{tool.pricing_model}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Starting at</span>
                    <span className="font-bold text-blue-600">{tool.starting_price}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
