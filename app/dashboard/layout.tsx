'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const navItems = [
  { href: '/dashboard', icon: '📊', label: 'Genel Bakış', exact: true },
  { href: '/dashboard/menu', icon: '🍽️', label: 'Menü Yönetimi' },
  { href: '/dashboard/rezervasyonlar', icon: '📅', label: 'Rezervasyonlar' },
  { href: '/dashboard/qr', icon: '📱', label: 'QR Kod' },
  { href: '/dashboard/ayarlar', icon: '⚙️', label: 'Ayarlar' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function isActive(item: typeof navItems[0]) {
    if (item.exact) return pathname === item.href
    return pathname.startsWith(item.href)
  }

  async function handleLogout() {
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      await supabase.auth.signOut()
    } catch { /* ignore */ }
    toast.success('Çıkış yapıldı.')
    router.push('/')
    router.refresh()
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside className={`sidebar${sidebarOpen ? ' open' : ''}`}>
        {/* Logo */}
        <div style={{ padding: '0 20px 24px', borderBottom: '1px solid var(--border)' }}>
          <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
            }}>🍽️</div>
            <span style={{ fontSize: 18, fontWeight: 800 }}>
              <span className="gradient-text">Qrtela</span>
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 0' }}>
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-nav-item${isActive(item) ? ' active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border)' }}>
          <Link href="/" target="_blank" className="sidebar-nav-item" style={{ marginBottom: 4 }}>
            <span style={{ fontSize: 18 }}>🌐</span>
            <span>Menüyü Görüntüle</span>
          </Link>
          <button
            onClick={handleLogout}
            className="sidebar-nav-item btn-ghost"
            style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', justifyContent: 'flex-start' }}
          >
            <span style={{ fontSize: 18 }}>🚪</span>
            <span style={{ color: 'var(--danger)' }}>Çıkış Yap</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">
        <div style={{ padding: '32px' }}>
          {children}
        </div>
      </main>
    </div>
  )
}
