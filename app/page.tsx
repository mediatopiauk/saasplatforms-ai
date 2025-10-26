'use client'

import { useEffect, useState } from 'react'
import { supabase, Tool } from '@/lib/supabase'
import FilterBar from '@/components/FilterBar'
import ToolCard from '@/components/ToolCard'
import { Loader2 } from 'lucide-react'

const CATEGORIES = [
  { name: 'Sales & Marketing', slug: 'sales-marketing' },
  { name: 'Customer Service', slug: 'customer-service' },
  { name: 'Productivity', slug: 'productivity' },
  { name: 'Content Creation', slug: 'content-creation' },
  { name: 'Development', slug: 'development' },
]

export default function Home() {
  const [tools, setTools] = useState<Tool[]>([])
  const [filteredTools, setFilteredTools] = useState<Tool[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTools()
  }, [])

  useEffect(() => {
    filterTools()
  }, [tools, selectedCategory, searchQuery])

  async function fetchTools() {
    try {
      const { data, error } = await supabase
        .from('tools')
        .select('*')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) throw error
      setTools(data || [])
    } catch (error) {
      console.error('Error fetching tools:', error)
    } finally {
      setLoading(false)
    }
  }

  function filterTools() {
    let filtered = tools
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((tool) => tool.category === selectedCategory)
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (tool) =>
          tool.name.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query)
      )
    }
    setFilteredTools(filtered)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Find Your Perfect SaaS Tool</h1>
          <p className="text-xl text-blue-100">
            Compare AI-powered platforms and find the best fit for your business
          </p>
        </div>
      </header>

      <FilterBar
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filteredTools.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">No tools found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        )}
      </main>

      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2025 SaaS Platforms</p>
        </div>
      </footer>
    </div>
  )
}
