import { createBrowserClient } from '@supabase/ssr'

export function isConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  return !!(
    url && key &&
    url.startsWith('http') &&
    !url.includes('your_supabase') &&
    key !== 'your_supabase_anon_key'
  )
}

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createBrowserClient(url, key)
}
