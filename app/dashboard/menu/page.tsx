'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import type { MenuCategory, MenuItem } from '@/types'

type CategoryWithItems = MenuCategory & { menu_items: MenuItem[] }

export default function MenuPage() {
  const supabase = createClient()
  const [restaurant, setRestaurant] = useState<{ id: string; name: string } | null>(null)
  const [categories, setCategories] = useState<CategoryWithItems[]>([])
  const [loading, setLoading] = useState(true)

  // Modal states
  const [showCatModal, setShowCatModal] = useState(false)
  const [showItemModal, setShowItemModal] = useState(false)
  const [editingCat, setEditingCat] = useState<MenuCategory | null>(null)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [selectedCatId, setSelectedCatId] = useState<string>('')

  // Form states
  const [catName, setCatName] = useState('')
  const [itemName, setItemName] = useState('')
  const [itemDesc, setItemDesc] = useState('')
  const [itemPrice, setItemPrice] = useState('')
  const [itemCatId, setItemCatId] = useState('')
  const [itemAvailable, setItemAvailable] = useState(true)
  const [saving, setSaving] = useState(false)

  const loadData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: rest } = await supabase.from('restaurants').select('id,name').eq('owner_id', user.id).single()
    if (!rest) return
    setRestaurant(rest)

    const { data: cats } = await supabase
      .from('menu_categories')
      .select('*, menu_items(*)')
      .eq('restaurant_id', rest.id)
      .order('order_index')
    setCategories((cats as CategoryWithItems[]) || [])
    setLoading(false)
  }, [supabase])

  useEffect(() => { loadData() }, [loadData])

  // Category CRUD
  function openAddCat() { setEditingCat(null); setCatName(''); setShowCatModal(true) }
  function openEditCat(cat: MenuCategory) { setEditingCat(cat); setCatName(cat.name); setShowCatModal(true) }

  async function saveCat() {
    if (!catName.trim() || !restaurant) return
    setSaving(true)
    try {
      if (editingCat) {
        const { error } = await supabase.from('menu_categories').update({ name: catName }).eq('id', editingCat.id)
        if (error) throw error
        toast.success('Kategori güncellendi.')
      } else {
        const { error } = await supabase.from('menu_categories').insert({ restaurant_id: restaurant.id, name: catName, order_index: categories.length })
        if (error) throw error
        toast.success('Kategori eklendi.')
      }
      setShowCatModal(false)
      loadData()
    } catch { toast.error('Hata oluştu.') } finally { setSaving(false) }
  }

  async function deleteCat(id: string) {
    if (!confirm('Bu kategoriyi ve tüm ürünleri silmek istediğinizden emin misiniz?')) return
    const { error } = await supabase.from('menu_categories').delete().eq('id', id)
    if (error) { toast.error('Silinemedi.'); return }
    toast.success('Kategori silindi.')
    loadData()
  }

  // Item CRUD
  function openAddItem(catId: string) {
    setEditingItem(null)
    setItemName(''); setItemDesc(''); setItemPrice(''); setItemCatId(catId); setItemAvailable(true)
    setSelectedCatId(catId)
    setShowItemModal(true)
  }
  function openEditItem(item: MenuItem) {
    setEditingItem(item)
    setItemName(item.name); setItemDesc(item.description || ''); setItemPrice(String(item.price))
    setItemCatId(item.category_id || ''); setItemAvailable(item.is_available)
    setShowItemModal(true)
  }

  async function saveItem() {
    if (!itemName.trim() || !restaurant) return
    setSaving(true)
    try {
      const payload = {
        restaurant_id: restaurant.id,
        category_id: itemCatId || null,
        name: itemName,
        description: itemDesc || null,
        price: parseFloat(itemPrice) || 0,
        is_available: itemAvailable,
      }
      if (editingItem) {
        const { error } = await supabase.from('menu_items').update(payload).eq('id', editingItem.id)
        if (error) throw error
        toast.success('Ürün güncellendi.')
      } else {
        const { error } = await supabase.from('menu_items').insert(payload)
        if (error) throw error
        toast.success('Ürün eklendi.')
      }
      setShowItemModal(false)
      loadData()
    } catch { toast.error('Hata oluştu.') } finally { setSaving(false) }
  }

  async function deleteItem(id: string) {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return
    const { error } = await supabase.from('menu_items').delete().eq('id', id)
    if (error) { toast.error('Silinemedi.'); return }
    toast.success('Ürün silindi.')
    loadData()
  }

  async function toggleItemAvailable(item: MenuItem) {
    const { error } = await supabase.from('menu_items').update({ is_available: !item.is_available }).eq('id', item.id)
    if (!error) loadData()
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
      <div className="animate-spin" style={{ width: 40, height: 40, border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%' }} />
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.5px' }}>Menü Yönetimi</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>Kategori ve ürünlerinizi yönetin</p>
        </div>
        <button className="btn btn-primary" onClick={openAddCat}>
          ➕ Kategori Ekle
        </button>
      </div>

      {/* Empty state */}
      {categories.length === 0 && (
        <div className="empty-state card" style={{ padding: 64 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🍽️</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Menünüz boş</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>
            İlk kategorinizi ekleyerek menü oluşturmaya başlayın.
          </p>
          <button className="btn btn-primary" onClick={openAddCat}>➕ İlk Kategoriyi Ekle</button>
        </div>
      )}

      {/* Categories */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {categories.map(cat => (
          <div key={cat.id} className="card" style={{ padding: 24 }}>
            {/* Category header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                }}>📂</div>
                <h2 style={{ fontWeight: 700, fontSize: 16 }}>{cat.name}</h2>
                <span className="badge badge-muted">{cat.menu_items?.length || 0} ürün</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-secondary btn-sm" onClick={() => openAddItem(cat.id)}>+ Ürün</button>
                <button className="btn btn-secondary btn-sm" onClick={() => openEditCat(cat)}>✏️</button>
                <button className="btn btn-danger btn-sm" onClick={() => deleteCat(cat.id)}>🗑️</button>
              </div>
            </div>

            {/* Items */}
            {(!cat.menu_items || cat.menu_items.length === 0) ? (
              <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
                Bu kategoride henüz ürün yok.{' '}
                <button onClick={() => openAddItem(cat.id)} style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                  Ürün ekle →
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {cat.menu_items.map(item => (
                  <div key={item.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 16px',
                    background: 'rgba(255,255,255,0.03)', borderRadius: 10,
                    border: '1px solid rgba(255,255,255,0.05)',
                    flexWrap: 'wrap', gap: 12,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 200 }}>
                      <label className="toggle">
                        <input type="checkbox" checked={item.is_available} onChange={() => toggleItemAvailable(item)} />
                        <span className="toggle-slider" />
                      </label>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</p>
                        {item.description && <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 2 }}>{item.description}</p>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 15 }}>
                        ₺{Number(item.price).toFixed(2)}
                      </span>
                      <button className="btn btn-secondary btn-sm" onClick={() => openEditItem(item)}>✏️</button>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteItem(item.id)}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Category Modal */}
      {showCatModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowCatModal(false)}>
          <div className="modal">
            <h2 style={{ fontWeight: 800, fontSize: 20, marginBottom: 24 }}>
              {editingCat ? 'Kategoriyi Düzenle' : 'Yeni Kategori'}
            </h2>
            <div style={{ marginBottom: 20 }}>
              <label className="input-label">Kategori Adı</label>
              <input className="input" value={catName} onChange={e => setCatName(e.target.value)} placeholder="Başlangıçlar, Ana Yemekler..." autoFocus onKeyDown={e => e.key === 'Enter' && saveCat()} />
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setShowCatModal(false)}>İptal</button>
              <button className="btn btn-primary" onClick={saveCat} disabled={saving || !catName.trim()}>
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Item Modal */}
      {showItemModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowItemModal(false)}>
          <div className="modal">
            <h2 style={{ fontWeight: 800, fontSize: 20, marginBottom: 24 }}>
              {editingItem ? 'Ürünü Düzenle' : 'Yeni Ürün'}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="input-label">Ürün Adı *</label>
                <input className="input" value={itemName} onChange={e => setItemName(e.target.value)} placeholder="Ürün adını girin" autoFocus />
              </div>
              <div>
                <label className="input-label">Açıklama</label>
                <textarea className="input" value={itemDesc} onChange={e => setItemDesc(e.target.value)} placeholder="Kısa açıklama (opsiyonel)" rows={3} style={{ resize: 'vertical' }} />
              </div>
              <div>
                <label className="input-label">Fiyat (₺) *</label>
                <input className="input" type="number" value={itemPrice} onChange={e => setItemPrice(e.target.value)} placeholder="0.00" min="0" step="0.01" />
              </div>
              <div>
                <label className="input-label">Kategori</label>
                <select className="input" value={itemCatId} onChange={e => setItemCatId(e.target.value)}
                  style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' }}>
                  <option value="">Kategorisiz</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <label className="toggle">
                  <input type="checkbox" checked={itemAvailable} onChange={e => setItemAvailable(e.target.checked)} />
                  <span className="toggle-slider" />
                </label>
                <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Mevcut (müşterilere göster)</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
              <button className="btn btn-secondary" onClick={() => setShowItemModal(false)}>İptal</button>
              <button className="btn btn-primary" onClick={saveItem} disabled={saving || !itemName.trim()}>
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
