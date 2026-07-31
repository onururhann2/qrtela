import { createClient, isConfigured } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { MenuCategoryWithItems, Restaurant } from '@/types'
import PublicMenuClient from './PublicMenuClient'

export const dynamic = 'force-dynamic'

const DEMO_RESTAURANT: Restaurant = {
  id: 'demo-restoran-id',
  owner_id: 'demo-owner',
  name: 'Saray Lezzetleri (Demo)',
  slug: 'demo-restoran',
  description: 'Geleneksel Türk mutfağının ve taş fırın lezzetlerinin buluşma noktası. Taze malzemeler, zırh kıyması kebaplar ve ev yapımı tatlılar.',
  logo_url: null,
  cover_url: null,
  instagram_url: 'https://instagram.com',
  whatsapp_number: '905551234567',
  address: 'Bağdat Caddesi No:142, Kadıköy / İstanbul',
  phone: '+90 (216) 555 0123',
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

const DEMO_CATEGORIES: MenuCategoryWithItems[] = [
  {
    id: 'cat-1',
    restaurant_id: 'demo-restoran-id',
    name: '🔥 Başlangıçlar & Mezeler',
    description: 'Günlük taze hazırlanan özel mezelerimiz',
    order_index: 0,
    is_active: true,
    created_at: new Date().toISOString(),
    menu_items: [
      { id: 'item-1', restaurant_id: 'demo-restoran-id', category_id: 'cat-1', name: 'Humus & Fıstıklı Sıcak Tereyağı', description: 'Nohut, süzme tahin, sarımsak ve Antep fıstıklı sıcak tereyağı sosu', price: 145, image_url: null, is_available: true, order_index: 0, created_at: '', updated_at: '' },
      { id: 'item-2', restaurant_id: 'demo-restoran-id', category_id: 'cat-1', name: 'Cevizli Gavurdağı Salatası', description: 'İnce kıyım domates, salatalık, taze ceviz içi ve özel nar ekşili sos', price: 130, image_url: null, is_available: true, order_index: 1, created_at: '', updated_at: '' },
      { id: 'item-3', restaurant_id: 'demo-restoran-id', category_id: 'cat-1', name: 'Şakşuka & Yoğurtlama', description: 'Közlenmiş patlıcan, biber, domates sosu ve süzme yoğurt', price: 110, image_url: null, is_available: true, order_index: 2, created_at: '', updated_at: '' },
    ],
  },
  {
    id: 'cat-2',
    restaurant_id: 'demo-restoran-id',
    name: '🍢 Kebaplar & Ana Yemekler',
    description: 'Kömür ateşinde zırh kıyması ile hazırlanan kebaplar',
    order_index: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    menu_items: [
      { id: 'item-4', restaurant_id: 'demo-restoran-id', category_id: 'cat-2', name: 'Zırh Kıyması Adana Kebap', description: 'Köz biber, köz domates, sumaklı soğan ve tırnak pide ile', price: 340, image_url: null, is_available: true, order_index: 0, created_at: '', updated_at: '' },
      { id: 'item-5', restaurant_id: 'demo-restoran-id', category_id: 'cat-2', name: 'Kuzu Şiş Kebap', description: 'Karamelize soğan, pirinç pilavı ve lavaj eşliğinde', price: 390, image_url: null, is_available: true, order_index: 1, created_at: '', updated_at: '' },
      { id: 'item-6', restaurant_id: 'demo-restoran-id', category_id: 'cat-2', name: 'Taş Fırın Karışık Pide', description: 'Kuşbaşı et, kaşar peyniri, mantar ve sucuk', price: 270, image_url: null, is_available: true, order_index: 2, created_at: '', updated_at: '' },
      { id: 'item-7', restaurant_id: 'demo-restoran-id', category_id: 'cat-2', name: 'Ali Nazik Kebap', description: 'Közlenmiş patlıcanlı süzme yoğurt yatağında sote kuzu eti', price: 360, image_url: null, is_available: true, order_index: 3, created_at: '', updated_at: '' },
    ],
  },
  {
    id: 'cat-3',
    restaurant_id: 'demo-restoran-id',
    name: '🍰 Tatlılar',
    description: 'Geleneksel el yapımı tatlılar',
    order_index: 2,
    is_active: true,
    created_at: new Date().toISOString(),
    menu_items: [
      { id: 'item-8', restaurant_id: 'demo-restoran-id', category_id: 'cat-3', name: 'Fıstıklı Hatay Künefesi', description: 'Hakiki Antakya peynirli, dondurma veya kaymak servisi ile', price: 190, image_url: null, is_available: true, order_index: 0, created_at: '', updated_at: '' },
      { id: 'item-9', restaurant_id: 'demo-restoran-id', category_id: 'cat-3', name: 'Fırın Sütlaç', description: 'Geleneksel Usul, fındık parçacıkları ile', price: 95, image_url: null, is_available: true, order_index: 1, created_at: '', updated_at: '' },
    ],
  },
  {
    id: 'cat-4',
    restaurant_id: 'demo-restoran-id',
    name: '🥤 İçecekler',
    description: 'Soğuk ve sıcak meşrubatlar',
    order_index: 3,
    is_active: true,
    created_at: new Date().toISOString(),
    menu_items: [
      { id: 'item-10', restaurant_id: 'demo-restoran-id', category_id: 'cat-4', name: 'Ev Yapımı Yayık Ayranı', description: 'Bakır maşrapada bol köpüklü soğuk servis', price: 50, image_url: null, is_available: true, order_index: 0, created_at: '', updated_at: '' },
      { id: 'item-11', restaurant_id: 'demo-restoran-id', category_id: 'cat-4', name: 'Osmanlı Şerbeti', description: 'Demirhindi ve baharatlarla demlenmiş soğuk şerbet', price: 60, image_url: null, is_available: true, order_index: 1, created_at: '', updated_at: '' },
    ],
  },
]

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (slug === 'demo-restoran') {
    return { title: 'Saray Lezzetleri (Demo) — Dijital Menü', description: 'Demo Restoran Dijital Menüsü' }
  }
  if (!isConfigured()) return { title: `${slug} — Dijital Menü` }
  const supabase = await createClient()
  const { data: restaurant } = await supabase
    .from('restaurants').select('name, description').eq('slug', slug).single()
  if (!restaurant) return { title: 'Restoran Bulunamadı' }
  return {
    title: `${restaurant.name} — Dijital Menü`,
    description: restaurant.description || `${restaurant.name} dijital menüsü`,
  }
}

export default async function RestaurantMenuPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  // Always render demo restaurant for /demo-restoran
  if (slug === 'demo-restoran') {
    return <PublicMenuClient restaurant={DEMO_RESTAURANT} categories={DEMO_CATEGORIES} />
  }

  if (!isConfigured()) {
    // If not configured and accessing non-demo slug, show friendly demo fallback
    return <PublicMenuClient restaurant={{ ...DEMO_RESTAURANT, slug }} categories={DEMO_CATEGORIES} />
  }

  const supabase = await createClient()

  const { data: restaurant } = await supabase
    .from('restaurants').select('*').eq('slug', slug).eq('is_active', true).single()

  if (!restaurant) {
    // Fallback to demo restaurant if slug is not found in database yet
    return <PublicMenuClient restaurant={{ ...DEMO_RESTAURANT, name: `${slug.toUpperCase()} Restoran (Örnek)` }} categories={DEMO_CATEGORIES} />
  }

  const { data: categories } = await supabase
    .from('menu_categories')
    .select('*, menu_items(*)')
    .eq('restaurant_id', restaurant.id)
    .eq('is_active', true)
    .order('order_index')

  const filteredCats = (categories as MenuCategoryWithItems[] || []).map(cat => ({
    ...cat,
    menu_items: cat.menu_items?.filter(item => item.is_available) || [],
  }))

  return <PublicMenuClient restaurant={restaurant as Restaurant} categories={filteredCats} />
}
