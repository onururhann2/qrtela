'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

function slugify(text: string) {
  return text
    .toLowerCase().trim()
    .replace(/\s+/g, '-')
    .replace(/[ğ]/g, 'g').replace(/[ü]/g, 'u').replace(/[ş]/g, 's')
    .replace(/[ı]/g, 'i').replace(/[ö]/g, 'o').replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-')
}

export default function RegisterPage() {
  const [restaurantName, setRestaurantName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const router = useRouter()

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setErrorMessage(null)

    if (password.length < 6) {
      toast.error('Şifre en az 6 karakter olmalı.')
      return
    }

    setLoading(true)

    try {
      const { isConfigured, createClient } = await import('@/lib/supabase/client')
      if (!isConfigured()) {
        const msg = 'Supabase henüz yapılandırılmamış. Lütfen .env.local dosyasını doldurun.'
        setErrorMessage(msg)
        toast.error(msg)
        return
      }

      const supabase = createClient()

      // 1. Sign Up
      const { data: authData, error: authError } = await supabase.auth.signUp({ email, password })
      if (authError) {
        console.error('Auth Error:', authError)
        throw new Error(authError.message)
      }

      let user = authData.user

      // If user wasn't returned or session wasn't active, try signing in directly
      if (!authData.session) {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
        if (!signInError && signInData.user) {
          user = signInData.user
        }
      }

      if (!user) {
        throw new Error('Kullanıcı oluşturulamadı. Lütfen e-posta adresinizi doğrulayın veya tekrar deneyin.')
      }

      // 2. Insert Restaurant
      const baseSlug = slugify(restaurantName)
      const uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`

      const { error: restaurantError } = await supabase.from('restaurants').insert({
        owner_id: user.id,
        name: restaurantName,
        slug: uniqueSlug,
      })

      if (restaurantError) {
        console.error('Restaurant Insert Error:', restaurantError)
        if (restaurantError.code === '42P01' || restaurantError.message.includes('does not exist')) {
          throw new Error('Veritabanı tabloları henüz oluşturulmamış! Lütfen Supabase SQL Editor kısmında verilen SQL kodunu çalıştırın.')
        } else if (restaurantError.code === '42501' || restaurantError.message.includes('violates row-level security')) {
          throw new Error('Supabase RLS engeli: Lütfen Supabase Dashboard > Authentication > Providers > Email altındaki "Confirm Email" seçeneğini KAPATIN.')
        } else {
          throw new Error(restaurantError.message)
        }
      }

      toast.success('Hesabınız ve restoranınız oluşturuldu! 🎉')
      router.push('/dashboard')
      router.refresh()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Kayıt başarısız.'
      console.error('Registration Catch Error:', err)
      setErrorMessage(message)
      toast.error(message, { duration: 6000 })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-dark)', padding: 24, position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: 440, position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
            }}>🍽️</div>
            <span style={{ fontSize: 24, fontWeight: 800 }}>
              <span className="gradient-text">Qrtela</span>
            </span>
          </Link>
          <h1 style={{ fontSize: 26, fontWeight: 800, marginTop: 28, marginBottom: 8, letterSpacing: '-0.5px' }}>
            Restoranınızı ekleyin
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Ücretsiz hesap oluşturun, hemen başlayın
          </p>
        </div>

        <div className="card" style={{ padding: 36 }}>
          {errorMessage && (
            <div style={{
              padding: 16, borderRadius: 10, marginBottom: 20,
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#fca5a5', fontSize: 13, lineHeight: 1.6,
            }}>
              <strong>⚠️ Hata:</strong> {errorMessage}
            </div>
          )}

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label className="input-label" htmlFor="restaurantName">Restoran Adı</label>
              <input
                id="restaurantName" type="text" className="input"
                placeholder="Örn: Köfteci Ahmet"
                value={restaurantName} onChange={e => setRestaurantName(e.target.value)} required
              />
              {restaurantName && (
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
                  Menü URL&apos;niz: <code style={{ color: 'var(--primary)' }}>/{slugify(restaurantName)}-xxxx</code>
                </p>
              )}
            </div>
            <div>
              <label className="input-label" htmlFor="email">E-posta Adresi</label>
              <input
                id="email" type="email" className="input"
                placeholder="restoran@ornek.com"
                value={email} onChange={e => setEmail(e.target.value)}
                required autoComplete="email"
              />
            </div>
            <div>
              <label className="input-label" htmlFor="password">Şifre</label>
              <input
                id="password" type="password" className="input"
                placeholder="En az 6 karakter"
                value={password} onChange={e => setPassword(e.target.value)}
                required autoComplete="new-password" minLength={6}
              />
            </div>
            <button
              type="submit" className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', height: 48, fontSize: 15, marginTop: 4 }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="animate-spin" style={{
                    display: 'inline-block', width: 16, height: 16,
                    border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%',
                  }} />
                  Hesap oluşturuluyor...
                </span>
              ) : '🎉 Ücretsiz Hesap Aç'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--text-secondary)', fontSize: 14 }}>
          Zaten hesabınız var mı?{' '}
          <Link href="/auth/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
            Giriş yapın →
          </Link>
        </p>
      </div>
    </div>
  )
}
