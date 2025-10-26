#!/bin/bash

# Create package.json
cat > package.json << 'EOF'
{
  "name": "saasplatforms-ai",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.2.5",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@supabase/supabase-js": "^2.39.0",
    "lucide-react": "^0.263.1"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10",
    "postcss": "^8",
    "tailwindcss": "^3"
  }
}
EOF

# Create tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{"name": "next"}],
    "paths": {"@/*": ["./*"]}
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
EOF

# Create next.config.js
cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['logo.clearbit.com'],
  },
};
module.exports = nextConfig;
EOF

# Create tailwind.config.ts
cat > tailwind.config.ts << 'EOF'
import type { Config } from "tailwindcss";
const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: { extend: {} },
  plugins: [],
};
export default config;
EOF

# Create postcss.config.mjs
cat > postcss.config.mjs << 'EOF'
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
export default config;
EOF

# Create .env.local
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://elwxyjnmbbxlqquzqmhp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsd3h5am5tYmJ4bHFxdXpxbWhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0NjI0NTQsImV4cCI6MjA3NzAzODQ1NH0.gapkzrKA3LxALRc2CyZFfLUysPLNulD_biwtyPewZ_U
EOF

# Create .gitignore
cat > .gitignore << 'EOF'
node_modules
.next
.env*.local
.vercel
*.log
.DS_Store
EOF

# Create directories
mkdir -p app components lib

# Create lib/supabase.ts
cat > lib/supabase.ts << 'EOF'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Tool {
  id: string
  name: string
  description: string
  logo_url: string
  website_url: string
  category: string
  pricing_model: string
  starting_price: string
  features: string[]
  integrations: string[]
  affiliate_link: string | null
  featured: boolean
  created_at: string
}
EOF

# Create app/globals.css
cat > app/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF

# Create app/layout.tsx
cat > app/layout.tsx << 'EOF'
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SaaS Platforms - Compare AI Tools",
  description: "Compare and find the best AI SaaS platforms",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
EOF

# Create app/page.tsx
cat > app/page.tsx << 'EOF'
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
EOF

# Create components/FilterBar.tsx
cat > components/FilterBar.tsx << 'EOF'
'use client'

interface FilterBarProps {
  categories: { name: string; slug: string }[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export default function FilterBar({
  categories,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: FilterBarProps) {
  return (
    <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
EOF

# Create components/ToolCard.tsx
cat > components/ToolCard.tsx << 'EOF'
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
