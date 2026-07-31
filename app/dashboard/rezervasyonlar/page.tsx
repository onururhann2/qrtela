'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import type { Reservation } from '@/types'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

const STATUS_LABELS: Record<string, string> = {
  pending: 'Bekliyor',
  confirmed: 'Onaylandı',
  cancelled: 'İptal',
}
const STATUS_CLASSES: Record<string, string> = {
  pending: 'badge-warning',
  confirmed: 'badge-success',
  cancelled: 'badge-danger',
}

export default function ReservasyonlarPage() {
  const supabase = createClient()
  const [restaurant, setRestaurant] = useState<{ id: string } | null>(null)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all')
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null)

  const loadData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: rest } = await supabase.from('restaurants').select('id').eq('owner_id', user.id).single()
    if (!rest) return
    setRestaurant(rest)

    let query = supabase
      .from('reservations')
      .select('*')
      .eq('restaurant_id', rest.id)
      .order('reservation_date', { ascending: false })
      .order('reservation_time', { ascending: false })

    if (filter !== 'all') query = query.eq('status', filter)

    const { data } = await query
    setReservations((data as Reservation[]) || [])
    setLoading(false)
  }, [supabase, filter])

  useEffect(() => { loadData() }, [loadData])

  async function updateStatus(id: string, status: 'confirmed' | 'cancelled') {
    const { error } = await supabase.from('reservations').update({ status }).eq('id', id)
    if (error) { toast.error('Güncellenemedi.'); return }
    toast.success(status === 'confirmed' ? 'Rezervasyon onaylandı ✅' : 'Rezervasyon iptal edildi.')
    setSelectedRes(null)
    loadData()
  }

  const formatDate = (date: string) => {
    try {
      return format(new Date(date), 'dd MMMM yyyy', { locale: tr })
    } catch { return date }
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
      <div className="animate-spin" style={{ width: 40, height: 40, border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%' }} />
    </div>
  )

  const pending = reservations.filter(r => r.status === 'pending').length

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.5px' }}>Rezervasyonlar</h1>
          {pending > 0 && <span className="badge badge-warning">{pending} bekliyor</span>}
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Gelen rezervasyonları onaylayın veya iptal edin</p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {(['all', 'pending', 'confirmed', 'cancelled'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
          >
            {f === 'all' ? 'Tümü' : STATUS_LABELS[f]}
          </button>
        ))}
      </div>

      {/* Empty */}
      {reservations.length === 0 && (
        <div className="empty-state card" style={{ padding: 64 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>📅</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Rezervasyon bulunamadı</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            {filter === 'all' ? 'Henüz rezervasyon alınmamış.' : `"${STATUS_LABELS[filter]}" durumunda rezervasyon yok.`}
          </p>
        </div>
      )}

      {/* Table */}
      {reservations.length > 0 && (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Müşteri', 'Tarih & Saat', 'Kişi', 'Durum', 'İşlem'].map(h => (
                    <th key={h} style={{
                      padding: '14px 20px', textAlign: 'left',
                      fontSize: 12, fontWeight: 600, color: 'var(--text-muted)',
                      textTransform: 'uppercase', letterSpacing: '0.5px',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reservations.map(res => (
                  <tr key={res.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '16px 20px' }}>
                      <p style={{ fontWeight: 600, fontSize: 14 }}>{res.customer_name}</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 2 }}>{res.customer_phone}</p>
                      {res.customer_email && <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>{res.customer_email}</p>}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <p style={{ fontWeight: 600, fontSize: 14 }}>{formatDate(res.reservation_date)}</p>
                      <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 2 }}>{res.reservation_time.substring(0, 5)}</p>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ fontWeight: 600 }}>{res.party_size} kişi</span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span className={`badge ${STATUS_CLASSES[res.status]}`}>{STATUS_LABELS[res.status]}</span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => setSelectedRes(res)}>
                          Detay
                        </button>
                        {res.status === 'pending' && (
                          <>
                            <button
                              className="btn btn-sm"
                              style={{ background: 'rgba(34,197,94,0.1)', color: 'var(--success)', border: '1px solid rgba(34,197,94,0.2)' }}
                              onClick={() => updateStatus(res.id, 'confirmed')}
                            >✅ Onayla</button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => updateStatus(res.id, 'cancelled')}
                            >❌ İptal</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail modal */}
      {selectedRes && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setSelectedRes(null)}>
          <div className="modal">
            <h2 style={{ fontWeight: 800, fontSize: 20, marginBottom: 24 }}>Rezervasyon Detayı</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: 'Müşteri Adı', value: selectedRes.customer_name },
                { label: 'Telefon', value: selectedRes.customer_phone },
                { label: 'E-posta', value: selectedRes.customer_email || '—' },
                { label: 'Tarih', value: formatDate(selectedRes.reservation_date) },
                { label: 'Saat', value: selectedRes.reservation_time.substring(0, 5) },
                { label: 'Kişi Sayısı', value: `${selectedRes.party_size} kişi` },
                { label: 'Not', value: selectedRes.notes || '—' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{row.label}</span>
                  <span style={{ fontWeight: 600, fontSize: 14, textAlign: 'right', maxWidth: '60%' }}>{row.value}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Durum</span>
                <span className={`badge ${STATUS_CLASSES[selectedRes.status]}`}>{STATUS_LABELS[selectedRes.status]}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
              {selectedRes.status === 'pending' && (
                <>
                  <button
                    className="btn btn-sm"
                    style={{ background: 'rgba(34,197,94,0.1)', color: 'var(--success)', border: '1px solid rgba(34,197,94,0.2)' }}
                    onClick={() => updateStatus(selectedRes.id, 'confirmed')}
                  >✅ Onayla</button>
                  <button className="btn btn-danger btn-sm" onClick={() => updateStatus(selectedRes.id, 'cancelled')}>❌ İptal Et</button>
                </>
              )}
              <button className="btn btn-secondary btn-sm" onClick={() => setSelectedRes(null)}>Kapat</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
