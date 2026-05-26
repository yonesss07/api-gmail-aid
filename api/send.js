const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  // 1. Validasi Kunci Keamanan agar cocok dengan Pterodactyl Anda
  const incomingKey = req.headers['x-api-key'] || req.query.key || req.body?.key;
  if (incomingKey !== 'AIDGANS') { 
    return res.status(403).json({ success: false, error: 'Akses Ditolak: Kunci API Salah!' });
  }

  // 2. Membaca data email dan password otomatis yang dikirim dari MongoDB bot Anda
  const { to, subject, text, html, user, pass } = req.body || {};

  // Menggunakan email dinamis dari bot, jika kosong baru pakai variabel Vercel
  const gmailUser = user || req.body?.email || process.env.GMAIL_USER;
  // Menggunakan Sandi Aplikasi dinamis dari bot, jika kosong baru pakai variabel Vercel
  const gmailPass = pass || req.body?.password || process.env.GMAIL_PASS;

  if (!gmailUser || !gmailPass) {
    return res.status(400).json({ success: false, error: 'Email atau Password kosong dari sistem bot!' });
  }

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailUser,
      pass: gmailPass
    }
  });

  try {
    await transporter.sendMail({
      from: gmailUser,
      to: to || "email-tujuan-default@gmail.com", 
      subject: subject || "Banding Akun",
      text: text || "Memproses pengajuan banding otomatis.",
      html: html || undefined
    });

    return res.status(200).json({ success: true, message: 'Email Berhasil Dikirim Otomatis!' });
  } catch (error) {
    // Jika Google menolak, lempar pesan error aslinya agar terbaca di Pterodactyl
    return res.status(500).json({ success: false, error: error.message });
  }
};

