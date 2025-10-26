'use client'

import { Tool } from '@/lib/supabase'
import { ExternalLink, Star } from 'lucide-react'

interface ToolCardProps {
  tool: Tool
}

export default function ToolCard({ tool }: ToolCardProps) {
  return (
    <div className="bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-lg border flex-shrink-0 bg-gray-50 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-400">{tool.name.charAt(0)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-semibold truncate">{tool.name}</h3>
            {tool.featured && (
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            )}
          </div>
          <p className="text-gray-600 text-sm mb-3">{tool.description}</p>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
              {tool.category}
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs">
              {tool.pricing_model}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold">{tool.starting_price}</span>
            
              href={tool.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              Visit Site
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
