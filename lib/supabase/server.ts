import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Valid JWT placeholder that passes Supabase SDK validation
const PLACEHOLDER_JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDE3NjkyMDAsImV4cCI6MTk1NzM0NTIwMH0.Q3g2RGxhY2Vob2xkZXJTaWduYXR1cmU'

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

export async function createClient() {
  const cookieStore = await cookies()
  const url = isConfigured()
    ? process.env.NEXT_PUBLIC_SUPABASE_URL!
    : 'https://placeholder.supabase.co'
  const key = isConfigured()
    ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    : PLACEHOLDER_JWT

  return createServerClient(url, key, {
    cookies: {
      getAll() { return cookieStore.getAll() },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch { /* server component */ }
      },
    },
  })
}
