import axios from 'axios';

export default async function handler(req, res) {
  // Hanya menerima metode POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // MODIFIKASI: Mengambil semua kemungkinan nama properti yang dikirim fixmerah.js
    const { target, email, to, message, text } = req.body;

    // Menentukan target tujuan (mana yang tersedia dari data fixmerah.js)
    const finalTarget = target || email || to;
    // Menentukan isi pesan
    const finalMessage = message || text || 'Halo dari Pterodactyl Panel';

    // Validasi input tujuan
    if (!finalTarget) {
      return res.status(400).json({ 
        error: 'Gagal memproses, data target/email tujuan tidak ditemukan dalam request.' 
      });
    }

    const apiUrl = 'https://vercel.app'; 
    const apiKey = process.env.AIDGANS; // Ambil dari Environment Variables

    const response = await axios.post(apiUrl, {
      to: finalTarget,
      text: finalMessage
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000 // Batas waktu 10 detik agar tidak hang
    });

    // Jika sukses kirim ke client
    return res.status(200).json({
      success: true,
      message: 'Pesan berhasil diproses',
      data: response.data
    });

  } catch (error) {
    console.error('API Process Failed:', error.message);
    
    if (error.response) {
      return res.status(error.response.status).json({
        error: 'Gagal merespons dari server pihak ketiga',
        detail: error.response.data
      });
    } else if (error.request) {
      return res.status(503).json({ error: 'Server tujuan tidak merespons (RTO)' });
    } else {
      return res.status(500).json({ error: 'Internal Server Error', detail: error.message });
    }
  }
}
