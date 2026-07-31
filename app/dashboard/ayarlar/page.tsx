'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import type { Restaurant } from '@/types'

export default function AyarlarPage() {
  const supabase = createClient()
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Form fields
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [instagram, setInstagram] = useState('')
  const [whatsapp, setWhatsapp] = useState('')

  const loadData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: rest } = await supabase.from('restaurants').select('*').eq('owner_id', user.id).single()
    if (rest) {
      setRestaurant(rest as Restaurant)
      setName(rest.name || '')
      setDescription(rest.description || '')
      setAddress(rest.address || '')
      setPhone(rest.phone || '')
      setInstagram(rest.instagram_url || '')
      setWhatsapp(rest.whatsapp_number || '')
    }
    setLoading(false)
  }, [supabase])

  useEffect(() => { loadData() }, [loadData])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!restaurant) return
    setSaving(true)
    try {
      const { error } = await supabase.from('restaurants').update({
        name,
        description: description || null,
        address: address || null,
        phone: phone || null,
        instagram_url: instagram || null,
        whatsapp_number: whatsapp || null,
      }).eq('id', restaurant.id)
      if (error) throw error
      toast.success('Ayarlar kaydedildi! ✅')
      loadData()
    } catch {
      toast.error('Kaydedilemedi.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
      <div className="animate-spin" style={{ width: 40, height: 40, border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%' }} />
    </div>
  )

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.5px' }}>Ayarlar</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>
          Restoran bilgilerinizi ve sosyal medya bağlantılarınızı güncelleyin
        </p>
      </div>

      <form onSubmit={handleSave}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 680 }}>
          {/* Genel bilgiler */}
          <div className="card" style={{ padding: 28 }}>
            <h2 style={{ fontWeight: 700, fontSize: 16, marginBottom: 20 }}>🏪 Genel Bilgiler</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label className="input-label">Restoran Adı *</label>
                <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="Restoranınızın adı" required />
              </div>
              {restaurant?.slug && (
                <div>
                  <label className="input-label">Menü URL&apos;niz</label>
                  <div style={{
                    padding: '10px 14px', background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                    fontSize: 14, color: 'var(--primary)',
                  }}>
                    /{restaurant.slug}
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
                    URL değiştirilemez (kayıt sırasında oluşturuldu)
                  </p>
                </div>
              )}
              <div>
                <label className="input-label">Açıklama</label>
                <textarea
                  className="input"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Restoranınız hakkında kısa bir açıklama"
                  rows={3}
                  style={{ resize: 'vertical' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label className="input-label">Adres</label>
                  <input className="input" value={address} onChange={e => setAddress(e.target.value)} placeholder="Restoran adresi" />
                </div>
                <div>
                  <label className="input-label">Telefon</label>
                  <input className="input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+90 555 000 0000" />
                </div>
              </div>
            </div>
          </div>

          {/* Sosyal medya */}
          <div className="card" style={{ padding: 28 }}>
            <h2 style={{ fontWeight: 700, fontSize: 16, marginBottom: 20 }}>🔗 Sosyal Medya</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label className="input-label">
                  <span style={{ color: '#e1306c' }}>📸</span> Instagram URL
                </label>
                <input
                  className="input"
                  value={instagram}
                  onChange={e => setInstagram(e.target.value)}
                  placeholder="https://instagram.com/restoranadi"
                  type="url"
                />
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
                  Menü sayfanızda Instagram butonu olarak görünür
                </p>
              </div>
              <div>
                <label className="input-label">
                  <span style={{ color: '#25d366' }}>💬</span> WhatsApp Numarası
                </label>
                <input
                  className="input"
                  value={whatsapp}
                  onChange={e => setWhatsapp(e.target.value)}
                  placeholder="905551234567 (başında + olmadan)"
                />
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
                  Ülke kodu dahil, boşluk ve + işareti olmadan yazın (örn: 905551234567)
                </p>
              </div>
            </div>
          </div>

          {/* Save button */}
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={saving}
            style={{ alignSelf: 'flex-start' }}
          >
            {saving ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="animate-spin" style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }} />
                Kaydediliyor...
              </span>
            ) : '💾 Ayarları Kaydet'}
          </button>
        </div>
      </form>
    </div>
  )
}
