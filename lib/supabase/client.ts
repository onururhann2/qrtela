import { createBrowserClient } from '@supabase/ssr'

const PLACEHOLDER_URL = 'https://placeholder.supabase.co'
const PLACEHOLDER_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDE3NjkyMDAsImV4cCI6MTk1NzM0NTIwMH0.Q3g2RGxhY2Vob2xkZXJTaWduYXR1cmU'

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
  const url = isConfigured()
    ? process.env.NEXT_PUBLIC_SUPABASE_URL!
    : PLACEHOLDER_URL
  const key = isConfigured()
    ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    : PLACEHOLDER_KEY

  return createBrowserClient(url, key)
}
