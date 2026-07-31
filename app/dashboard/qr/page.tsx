'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { generateQRCode, getMenuUrl } from '@/lib/qr'
import toast from 'react-hot-toast'

export default function QRPage() {
  const supabase = createClient()
  const [restaurant, setRestaurant] = useState<{ id: string; name: string; slug: string } | null>(null)
  const [qrDataUrl, setQrDataUrl] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [menuUrl, setMenuUrl] = useState('')

  const loadData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: rest } = await supabase.from('restaurants').select('id,name,slug').eq('owner_id', user.id).single()
    if (!rest) return
    setRestaurant(rest)
    const url = getMenuUrl(rest.slug)
    setMenuUrl(url)
    try {
      const qr = await generateQRCode(url)
      setQrDataUrl(qr)
    } catch {
      toast.error('QR kod oluşturulamadı.')
    }
    setLoading(false)
  }, [supabase])

  useEffect(() => { loadData() }, [loadData])

  function downloadQR() {
    if (!qrDataUrl || !restaurant) return
    const link = document.createElement('a')
    link.download = `${restaurant.slug}-qr-kod.png`
    link.href = qrDataUrl
    link.click()
    toast.success('QR kod indirildi! 📱')
  }

  function copyUrl() {
    navigator.clipboard.writeText(menuUrl)
    toast.success('Link kopyalandı!')
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
      <div className="animate-spin" style={{ width: 40, height: 40, border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%' }} />
    </div>
  )

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.5px' }}>QR Kod</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>
          Müşterileriniz için dijital menü QR kodu
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32, alignItems: 'start' }}>
        {/* QR Code Card */}
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          {qrDataUrl ? (
            <>
              <div style={{
                display: 'inline-block', padding: 20,
                background: 'white', borderRadius: 20,
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)', marginBottom: 24,
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrDataUrl} alt="Menü QR Kodu" style={{ width: 220, height: 220, display: 'block' }} />
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 24 }}>
                Bu QR kodu okutunca menü sayfanız açılır
              </p>
              <button className="btn btn-primary" onClick={downloadQR} style={{ width: '100%', height: 48 }}>
                ⬇️ PNG Olarak İndir
              </button>
            </>
          ) : (
            <div className="empty-state">
              <div style={{ fontSize: 48 }}>📱</div>
              <p>QR kod oluşturulamadı</p>
            </div>
          )}
        </div>

        {/* Info Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* URL Card */}
          <div className="card" style={{ padding: 24 }}>
            <h2 style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>🔗 Menü URL&apos;niz</h2>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              background: 'rgba(255,255,255,0.04)', borderRadius: 10,
              border: '1px solid var(--border)', padding: '12px 16px',
            }}>
              <span style={{ flex: 1, fontSize: 13, color: 'var(--primary)', wordBreak: 'break-all' }}>
                {menuUrl}
              </span>
              <button className="btn btn-secondary btn-sm" onClick={copyUrl} style={{ flexShrink: 0 }}>
                Kopyala
              </button>
            </div>
            <a
              href={menuUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
              style={{ width: '100%', marginTop: 12, height: 42 }}
            >
              🌐 Menüyü Aç
            </a>
          </div>

          {/* Usage tips */}
          <div className="card" style={{ padding: 24 }}>
            <h2 style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>💡 Kullanım İpuçları</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { icon: '🖨️', title: 'Yazdırın', desc: 'QR kodu indirip masalara koyun veya duvara yapıştırın.' },
                { icon: '📲', title: 'Paylaşın', desc: 'WhatsApp veya Instagram\'da müşterilerinizle paylaşın.' },
                { icon: '🔄', title: 'Anlık Güncellenir', desc: 'Menünüzü değiştirdiğinizde QR kodu yenilemenize gerek yok.' },
              ].map(tip => (
                <div key={tip.title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{tip.icon}</span>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{tip.title}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
