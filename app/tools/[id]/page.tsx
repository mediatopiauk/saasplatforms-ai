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

  if (!tool) return <div>Loading...</div>

  return (
    <div className="p-8">
      <button onClick={() => router.push('/')} className="mb-4 text-blue-600">Back</button>
      <h1 className="text-4xl font-bold mb-4">{tool.name}</h1>
      <p className="mb-4">{tool.description}</p>
      <p className="text-2xl font-bold mb-4">{tool.starting_price}</p>
      <a href={tool.website_url} target="_blank" className="px-6 py-3 bg-blue-600 text-white rounded">Visit</a>
    </div>
  )
}
