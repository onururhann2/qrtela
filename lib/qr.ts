import QRCode from 'qrcode'

export async function generateQRCode(url: string): Promise<string> {
  try {
    const qrDataUrl = await QRCode.toDataURL(url, {
      width: 400,
      margin: 2,
      color: {
        dark: '#1a1a2e',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    })
    return qrDataUrl
  } catch (error) {
    console.error('QR kod oluşturma hatası:', error)
    throw error
  }
}

export function getMenuUrl(slug: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  return `${baseUrl}/${slug}`
}
