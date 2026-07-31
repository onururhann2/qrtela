import { createClient, isConfigured } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

function slugify(text: string) {
  return text
    .toLowerCase().trim()
    .replace(/\s+/g, '-')
    .replace(/[ğ]/g, 'g').replace(/[ü]/g, 'u').replace(/[ş]/g, 's')
    .replace(/[ı]/g, 'i').replace(/[ö]/g, 'o').replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-')
}

export default async function DashboardPage() {
  if (!isConfigured()) {
    return (
      <div>
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800 }}>Panel</h1>
        </div>
        <div style={{
          padding: 32, borderRadius: 'var(--radius)',
          background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.3)',
        }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>⚙️</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Supabase Bağlantısı Gerekli</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
            Uygulamayı kullanmak için Supabase bağlantısını yapılandırmanız gerekiyor.
          </p>
        </div>
      </div>
    )
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Fetch or auto-create restaurant for user
  let { data: restaurant } = await supabase
    .from('restaurants').select('*').eq('owner_id', user.id).single()

  if (!restaurant) {
    // Auto-create default restaurant if user was added via Supabase dashboard or missing restaurant row
    const defaultName = user.email ? user.email.split('@')[0] + ' Restoran' : 'Restoranım'
    const defaultSlug = `${slugify(defaultName)}-${Math.random().toString(36).substring(2, 6)}`
    const { data: created } = await supabase.from('restaurants').insert({
      owner_id: user.id,
      name: defaultName,
      slug: defaultSlug,
    }).select().single()

    restaurant = created
  }

  const restId = restaurant?.id || ''

  // Parallel database queries for performance
  const [{ count: menuCount }, { count: reservationCount }, { count: categoryCount }] = await Promise.all([
    supabase.from('menu_items').select('*', { count: 'exact', head: true }).eq('restaurant_id', restId),
    supabase.from('reservations').select('*', { count: 'exact', head: true }).eq('restaurant_id', restId).eq('status', 'pending'),
    supabase.from('menu_categories').select('*', { count: 'exact', head: true }).eq('restaurant_id', restId),
  ])

  const stats = [
    { icon: '🍽️', label: 'Menü Ürünü', value: menuCount ?? 0, href: '/dashboard/menu', color: '#f97316' },
    { icon: '📅', label: 'Bekleyen Rezervasyon', value: reservationCount ?? 0, href: '/dashboard/rezervasyonlar', color: '#fbbf24' },
    { icon: '📂', label: 'Kategori', value: categoryCount ?? 0, href: '/dashboard/menu', color: '#22c55e' },
  ]

  const quickLinks = [
    { icon: '➕', label: 'Menü Ürünü Ekle', href: '/dashboard/menu', desc: 'Yeni ürün veya kategori ekle' },
    { icon: '📱', label: 'QR Kodu İndir', href: '/dashboard/qr', desc: 'Menü QR kodunu indir, paylaş' },
    { icon: '🌐', label: 'Menüyü Görüntüle', href: `/${restaurant?.slug || 'demo-restoran'}`, desc: 'Müşteri görünümünü incele' },
  ]

  return (
    <div>
      <div style={{ marginBottom: 40 }}>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 4 }}>Hoş geldiniz 👋</p>
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px' }}>
          {restaurant?.name || 'Restoranınız'}
        </h1>
        {restaurant?.slug && (
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 6 }}>
            Menü URL:&nbsp;
            <a href={`/${restaurant.slug}`} target="_blank" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
              /{restaurant.slug}
            </a>
          </p>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 40 }}>
        {stats.map(stat => (
          <Link key={stat.href + stat.label} href={stat.href} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ padding: 24, cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 8 }}>{stat.label}</p>
                  <p style={{ fontSize: 36, fontWeight: 900, color: stat.color }}>{stat.value}</p>
                </div>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: `${stat.color}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                }}>{stat.icon}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Hızlı Erişim</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        {quickLinks.map(link => (
          <Link key={link.href} href={link.href}
            target={link.href.startsWith('/') && !link.href.startsWith('/dashboard') ? '_blank' : undefined}
            style={{ textDecoration: 'none' }}>
            <div className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0,
              }}>{link.icon}</div>
              <div>
                <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{link.label}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>{link.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
