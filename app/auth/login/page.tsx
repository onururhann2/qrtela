'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const { isConfigured, createClient } = await import('@/lib/supabase/client')
      if (!isConfigured()) {
        toast.error('Supabase henüz yapılandırılmamış. Lütfen .env.local dosyasını doldurun.')
        return
      }
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      toast.success('Hoş geldiniz!')
      router.push('/dashboard')
      router.refresh()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Giriş başarısız'
      if (message === 'SUPABASE_NOT_CONFIGURED') {
        toast.error('Supabase bağlantısı yapılandırılmamış. Lütfen .env.local dosyasını doldurun.')
      } else if (message === 'Invalid login credentials') {
        toast.error('E-posta veya şifre hatalı.')
      } else {
        toast.error(message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-dark)', padding: 24, position: 'relative', overflow: 'hidden',
    }}>
      {/* BG orb */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 440, position: 'relative' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
            }}>🍽️</div>
            <span style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>
              <span className="gradient-text">Qrtela</span>
            </span>
          </Link>
          <h1 style={{ fontSize: 26, fontWeight: 800, marginTop: 28, marginBottom: 8, letterSpacing: '-0.5px' }}>
            Tekrar hoş geldiniz
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Restoran panelinize giriş yapın
          </p>
        </div>

        {/* Form */}
        <div className="card" style={{ padding: 36 }}>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label className="input-label" htmlFor="email">E-posta Adresi</label>
              <input
                id="email"
                type="email"
                className="input"
                placeholder="restoran@ornek.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label className="input-label" htmlFor="password">Şifre</label>
              <input
                id="password"
                type="password"
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', height: 48, fontSize: 15, marginTop: 4 }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="animate-spin" style={{
                    display: 'inline-block', width: 16, height: 16,
                    border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%',
                  }} />
                  Giriş yapılıyor...
                </span>
              ) : '🔐 Giriş Yap'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--text-secondary)', fontSize: 14 }}>
          Hesabınız yok mu?{' '}
          <Link href="/auth/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
            Ücretsiz kayıt olun →
          </Link>
        </p>
      </div>
    </div>
  )
}
