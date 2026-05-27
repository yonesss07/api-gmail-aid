import axios from 'axios';

export default async function handler(req, res) {
  // Hanya menerima metode POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { target, message } = req.body;

    // Validasi input
    if (!target) {
      return res.status(400).json({ error: 'Target nomor telepon wajib diisi' });
    }

    // PERBAIKAN: Tanda petik ganda di ujung sudah dihapus menjadi satu tanda petik tunggal saja
    const apiUrl = 'https://api-gmail-aid.vercel.app/api/send'; 
    const apiKey = process.env.AIDGANS; // Ambil dari Environment Variables

    const response = await axios.post(apiUrl, {
      to: target,
      text: message || 'Halo dari Pterodactyl Panel'
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
    // Menangkap error dari Axios dengan detail
    console.error('API Process Failed:', error.message);
    
    if (error.response) {
      // Error dari server tujuan (response code selain 2xx)
      return res.status(error.response.status).json({
        error: 'Gagal merespons dari server pihak ketiga',
        detail: error.response.data
      });
    } else if (error.request) {
      // Permintaan dikirim tapi tidak ada jawaban (Network Error)
      return res.status(503).json({ error: 'Server tujuan tidak merespons (RTO)' });
    } else {
      // Error konfigurasi internal script
      return res.status(500).json({ error: 'Internal Server Error', detail: error.message });
    }
  }
}

