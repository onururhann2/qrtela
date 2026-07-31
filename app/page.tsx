import Link from 'next/link'

export default function LandingPage() {
  const features = [
    {
      icon: '🍽️',
      title: 'Dijital Menü',
      desc: 'Kategorili, görsellerle zenginleştirilmiş, anlık güncellenebilen dijital menünüz.',
    },
    {
      icon: '📱',
      title: 'QR Kod Sistemi',
      desc: 'Müşterileriniz masadaki QR kodu okutup menüye anında erişsin.',
    },
    {
      icon: '📅',
      title: 'Rezervasyon',
      desc: 'Online rezervasyon formu. Rezervasyonları panelinizden yönetin.',
    },
    {
      icon: '🔗',
      title: 'Sosyal Medya',
      desc: 'Instagram ve WhatsApp bağlantılarınız menü sayfanızda öne çıksın.',
    },
    {
      icon: '🏪',
      title: 'Multi-Tenant',
      desc: 'Her restoran kendi izole paneliyle, platforma sınırsız restoran.',
    },
    {
      icon: '⚡',
      title: 'Anlık Yönetim',
      desc: 'Menü değişiklikleriniz anında yayınlanır. Sıfır teknik bilgi gerekli.',
    },
  ]

  const steps = [
    { num: '01', title: 'Hesap Oluştur', desc: 'Dakikalar içinde restoranınızı platforma ekleyin.' },
    { num: '02', title: 'Menünüzü Girin', desc: 'Kategoriler ve ürünleri kolayca ekleyin.' },
    { num: '03', title: 'QR Kodu Paylaşın', desc: 'Masalara koyun, müşteriler hemen erişsin.' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)' }}>
      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        padding: '0 24px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #f97316, #ea580c)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
          }}>🍽️</div>
          <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px' }}>
            <span className="gradient-text">Qrtela</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link href="/auth/login" className="btn btn-secondary btn-sm">Giriş Yap</Link>
          <Link href="/auth/register" className="btn btn-primary btn-sm">Ücretsiz Başla</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '120px 24px 80px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background orbs */}
        <div style={{
          position: 'absolute', top: '20%', left: '10%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '20%', right: '10%',
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(251,191,36,0.08) 0%, transparent 70%)',
          filter: 'blur(40px)', pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 800, position: 'relative' }} className="animate-fade-in">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)',
            borderRadius: 100, padding: '6px 16px', marginBottom: 24,
            fontSize: 13, fontWeight: 600, color: 'var(--primary)',
          }}>
            ✨ Restoranlar için Dijital Çözüm
          </div>

          <h1 style={{
            fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 900,
            lineHeight: 1.1, letterSpacing: '-2px', marginBottom: 24,
            fontFamily: "'Inter', sans-serif",
          }}>
            Restoranınızı{' '}
            <span className="gradient-text">Dijitalleştirin</span>,{' '}
            Müşterilerinizi{' '}
            <span className="gradient-text">Büyüleyin</span>
          </h1>

          <p style={{
            fontSize: 18, color: 'var(--text-secondary)', lineHeight: 1.7,
            maxWidth: 560, margin: '0 auto 40px',
          }}>
            Dijital menü, QR kod, online rezervasyon ve sosyal medya entegrasyonu —
            hepsi tek platformda. Kurulum <strong style={{ color: 'var(--text-primary)' }}>5 dakika</strong>.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/auth/register" className="btn btn-primary btn-lg">
              🚀 Ücretsiz Başla
            </Link>
            <Link href="/demo-restoran" className="btn btn-secondary btn-lg">
              👀 Demo Menüyü Gör
            </Link>
          </div>

          <p style={{ marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>
            Kredi kartı gerekmez · Ücretsiz kurulum · Anında yayınlanır
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="section" style={{ background: 'rgba(30,41,59,0.3)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 16 }}>
              İhtiyacınız olan her şey{' '}
              <span className="gradient-text">tek platformda</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 500, margin: '0 auto' }}>
              Restoranınızı büyütmek için tasarlanmış güçlü araçlar
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 24,
          }}>
            {features.map((f, i) => (
              <div key={i} className="card" style={{ padding: 28 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: 'rgba(249,115,22,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, marginBottom: 16,
                  border: '1px solid rgba(249,115,22,0.15)',
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 16 }}>
              3 adımda <span className="gradient-text">hazır</span>
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 32, maxWidth: 900, margin: '0 auto',
          }}>
            {steps.map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(249,115,22,0.2), rgba(251,191,36,0.1))',
                  border: '1px solid rgba(249,115,22,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px',
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 20, fontWeight: 700, color: 'var(--primary)',
                }}>
                  {s.num}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{s.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{
        background: 'linear-gradient(135deg, rgba(249,115,22,0.08), rgba(251,191,36,0.04))',
        borderTop: '1px solid var(--border)',
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, letterSpacing: '-1.5px', marginBottom: 20 }}>
            Hemen <span className="gradient-text">başlayın</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 480, margin: '0 auto 40px' }}>
            Dakikalar içinde restoranınızın dijital menüsünü oluşturun.
          </p>
          <Link href="/auth/register" className="btn btn-primary btn-lg" style={{ animation: 'pulse-glow 2s infinite' }}>
            🎉 Ücretsiz Hesap Aç
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '32px 24px',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: 14,
      }}>
        <p>© 2024 Qrtela — Dijital Restoran Platformu</p>
      </footer>
    </div>
  )
}
