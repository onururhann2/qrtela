import { createClient, isConfigured } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReservasyonForm from './ReservasyonForm'

export const dynamic = 'force-dynamic'

const DEMO_RESTAURANT = {
  id: 'demo-restoran-id',
  name: 'Saray Lezzetleri (Demo)',
  slug: 'demo-restoran',
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (slug === 'demo-restoran') return { title: 'Saray Lezzetleri (Demo) — Rezervasyon' }
  if (!isConfigured()) return { title: 'Rezervasyon' }
  const supabase = await createClient()
  const { data: restaurant } = await supabase.from('restaurants').select('name').eq('slug', slug).single()
  return { title: restaurant ? `${restaurant.name} — Rezervasyon` : 'Rezervasyon' }
}

export default async function ReservasyonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  if (slug === 'demo-restoran' || !isConfigured()) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-dark)' }}>
        <header style={{
          background: 'rgba(15,23,42,0.95)', backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border)', padding: '0 24px',
          position: 'sticky', top: 0, zIndex: 40,
        }}>
          <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', alignItems: 'center', height: 64, gap: 16 }}>
            <Link href={`/${slug}`} style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500 }}>
              ← Menüye Dön
            </Link>
            <div style={{ height: 20, width: 1, background: 'var(--border)' }} />
            <span style={{ fontWeight: 700, fontSize: 15 }}>{DEMO_RESTAURANT.name}</span>
          </div>
        </header>
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 24px 80px' }}>
          <div style={{ marginBottom: 36 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📅</div>
            <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 8 }}>Rezervasyon Yap</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
              <strong style={{ color: 'var(--text-primary)' }}>{DEMO_RESTAURANT.name}</strong> için masa rezervasyonu oluşturun.
            </p>
          </div>
          <div className="card" style={{ padding: 32 }}>
            <ReservasyonForm restaurantId={DEMO_RESTAURANT.id} restaurantName={DEMO_RESTAURANT.name} slug={slug} />
          </div>
        </div>
      </div>
    )
  }

  const supabase = await createClient()
  const { data: restaurant } = await supabase
    .from('restaurants').select('id, name, slug')
    .eq('slug', slug).eq('is_active', true).single()

  if (!restaurant) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-dark)' }}>
        <header style={{
          background: 'rgba(15,23,42,0.95)', backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border)', padding: '0 24px',
          position: 'sticky', top: 0, zIndex: 40,
        }}>
          <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', alignItems: 'center', height: 64, gap: 16 }}>
            <Link href={`/${slug}`} style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500 }}>
              ← Menüye Dön
            </Link>
            <div style={{ height: 20, width: 1, background: 'var(--border)' }} />
            <span style={{ fontWeight: 700, fontSize: 15 }}>{slug.toUpperCase()} Restoran</span>
          </div>
        </header>
        <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 24px 80px' }}>
          <div className="card" style={{ padding: 32 }}>
            <ReservasyonForm restaurantId="demo-id" restaurantName={slug} slug={slug} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)' }}>
      <header style={{
        background: 'rgba(15,23,42,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        padding: '0 24px',
        position: 'sticky', top: 0, zIndex: 40,
      }}>
        <div style={{ maxWidth: 680, margin: '0 auto', display: 'flex', alignItems: 'center', height: 64, gap: 16 }}>
          <Link href={`/${slug}`} style={{ textDecoration: 'none', color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500 }}>
            ← Menüye Dön
          </Link>
          <div style={{ height: 20, width: 1, background: 'var(--border)' }} />
          <span style={{ fontWeight: 700, fontSize: 15 }}>{restaurant.name}</span>
        </div>
      </header>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 24px 80px' }}>
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📅</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 8 }}>Rezervasyon Yap</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
            <strong style={{ color: 'var(--text-primary)' }}>{restaurant.name}</strong> için masa rezervasyonu oluşturun.
          </p>
        </div>
        <div className="card" style={{ padding: 32 }}>
          <ReservasyonForm restaurantId={restaurant.id} restaurantName={restaurant.name} slug={slug} />
        </div>
      </div>
    </div>
  )
}
