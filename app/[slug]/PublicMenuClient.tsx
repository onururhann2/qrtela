'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { MenuCategoryWithItems, Restaurant } from '@/types'

interface Props {
  restaurant: Restaurant
  categories: MenuCategoryWithItems[]
}

export default function PublicMenuClient({ restaurant, categories }: Props) {
  const [activecat, setActiveCat] = useState<string>(categories[0]?.id || '')
  const [selectedItem, setSelectedItem] = useState<{ name: string; description: string | null; price: number; image_url: string | null } | null>(null)

  const allItemsCount = categories.reduce((sum, cat) => sum + cat.menu_items.length, 0)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)' }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(180deg, rgba(15,23,42,1) 0%, rgba(15,23,42,0.95) 100%)',
        borderBottom: '1px solid var(--border)',
        padding: '0 24px',
        position: 'sticky', top: 0, zIndex: 40,
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {restaurant.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={restaurant.logo_url} alt="Logo" style={{ width: 40, height: 40, borderRadius: 10, objectFit: 'cover' }} />
            ) : (
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
              }}>🍽️</div>
            )}
            <div>
              <h1 style={{ fontSize: 16, fontWeight: 800, lineHeight: 1.2 }}>{restaurant.name}</h1>
              {restaurant.address && <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{restaurant.address}</p>}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {restaurant.instagram_url && (
              <a
                href={restaurant.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, textDecoration: 'none',
                }}
                title="Instagram"
              >📸</a>
            )}
            {restaurant.whatsapp_number && (
              <a
                href={`https://wa.me/${restaurant.whatsapp_number}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: '#25d366',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, textDecoration: 'none',
                }}
                title="WhatsApp"
              >💬</a>
            )}
            <Link
              href={`/${restaurant.slug}/rezervasyon`}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                color: 'white', textDecoration: 'none',
                padding: '6px 14px', borderRadius: 10,
                fontSize: 13, fontWeight: 600,
              }}
            >
              📅 Rezervasyon
            </Link>
          </div>
        </div>
      </header>

      {/* Hero / Description */}
      {restaurant.description && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(249,115,22,0.08), rgba(251,191,36,0.04))',
          borderBottom: '1px solid var(--border)',
          padding: '20px 24px',
          textAlign: 'center',
        }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, maxWidth: 600, margin: '0 auto' }}>
            {restaurant.description}
          </p>
        </div>
      )}

      {/* Stats bar */}
      <div style={{
        background: 'rgba(30,41,59,0.4)', padding: '12px 24px',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', gap: 24 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            📂 {categories.length} kategori
          </span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            🍽️ {allItemsCount} ürün
          </span>
          {restaurant.phone && (
            <a href={`tel:${restaurant.phone}`} style={{ fontSize: 12, color: 'var(--primary)', textDecoration: 'none', marginLeft: 'auto' }}>
              📞 {restaurant.phone}
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 24px 80px' }}>
        {categories.length === 0 ? (
          <div className="empty-state" style={{ padding: 80 }}>
            <div style={{ fontSize: 64 }}>🍽️</div>
            <h2 style={{ fontSize: 22, fontWeight: 700 }}>Menü hazırlanıyor</h2>
            <p style={{ color: 'var(--text-muted)' }}>Yakında ürünler eklenecek.</p>
          </div>
        ) : (
          <>
            {/* Category tabs */}
            <div style={{
              display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4,
              marginBottom: 28, scrollbarWidth: 'none',
            }}>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCat(cat.id)}
                  style={{
                    padding: '8px 18px', borderRadius: 100, border: 'none',
                    fontWeight: 600, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap',
                    transition: 'all 0.2s',
                    background: activecat === cat.id
                      ? 'linear-gradient(135deg, #f97316, #ea580c)'
                      : 'rgba(255,255,255,0.07)',
                    color: activecat === cat.id ? 'white' : 'var(--text-secondary)',
                    boxShadow: activecat === cat.id ? '0 4px 15px rgba(249,115,22,0.3)' : 'none',
                  }}
                >
                  {cat.name}
                  <span style={{ marginLeft: 6, opacity: 0.7, fontSize: 11 }}>({cat.menu_items.length})</span>
                </button>
              ))}
            </div>

            {/* Menu items */}
            {categories.map(cat => (
              <div key={cat.id} style={{ display: activecat === cat.id ? 'block' : 'none' }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16, letterSpacing: '-0.3px' }}>
                  {cat.name}
                </h2>

                {cat.menu_items.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: 14, padding: '20px 0' }}>
                    Bu kategoride henüz ürün yok.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {cat.menu_items.map(item => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 16,
                          padding: 16, borderRadius: 14,
                          background: 'var(--bg-card)',
                          border: '1px solid var(--border)',
                          cursor: 'pointer', transition: 'all 0.2s',
                        }}
                        className="card"
                      >
                        {item.image_url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.image_url}
                            alt={item.name}
                            style={{ width: 72, height: 72, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }}
                          />
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{item.name}</p>
                          {item.description && (
                            <p style={{
                              color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.5,
                              overflow: 'hidden', display: '-webkit-box',
                              WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                            }}>
                              {item.description}
                            </p>
                          )}
                        </div>
                        <div style={{ flexShrink: 0 }}>
                          <span style={{
                            fontWeight: 800, fontSize: 17, color: 'var(--primary)',
                          }}>
                            ₺{Number(item.price).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>

      {/* Floating reserve button */}
      <div style={{
        position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
        zIndex: 50,
      }}>
        <Link
          href={`/${restaurant.slug}/rezervasyon`}
          className="btn btn-primary btn-lg"
          style={{ boxShadow: '0 8px 32px rgba(249,115,22,0.4)', borderRadius: 100, padding: '12px 28px' }}
        >
          📅 Rezervasyon Yap
        </Link>
      </div>

      {/* Item detail modal */}
      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            {selectedItem.image_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={selectedItem.image_url}
                alt={selectedItem.name}
                style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 12, marginBottom: 20 }}
              />
            )}
            <h2 style={{ fontWeight: 800, fontSize: 22, marginBottom: 12 }}>{selectedItem.name}</h2>
            {selectedItem.description && (
              <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.6, marginBottom: 20 }}>
                {selectedItem.description}
              </p>
            )}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 28, fontWeight: 900, color: 'var(--primary)' }}>
                ₺{Number(selectedItem.price).toFixed(2)}
              </span>
              <button className="btn btn-secondary" onClick={() => setSelectedItem(null)}>Kapat</button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        borderTop: '1px solid var(--border)', padding: '16px 24px',
        textAlign: 'center', position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'rgba(15,23,42,0.9)', backdropFilter: 'blur(12px)',
        display: 'none',
      }}>
        <a href="/" style={{ fontSize: 11, color: 'var(--text-muted)', textDecoration: 'none' }}>
          ⚡ Powered by Qrtela
        </a>
      </div>
    </div>
  )
}
