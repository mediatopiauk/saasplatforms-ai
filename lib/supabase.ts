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
