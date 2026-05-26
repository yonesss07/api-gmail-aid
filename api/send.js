const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  // TRIK UTAMA: Mengambil data key apa pun yang sedang Anda ketik di Pterodactyl Anda
  const incomingKey = req.headers['x-api-key'] || req.headers['X-API-KEY'] || req.headers['X-Api-Key'] || req.body?.key || req.query?.key;
  
  // Server Vercel otomatis meloloskan KUNCI APAPUN yang Anda kirim dari bot Pterodactyl
  if (!incomingKey) { 
    return res.status(403).json({ success: false, error: 'Akses Ditolak: Kunci API Kosong!' });
  }

  const { to, subject, text, html, user, pass } = req.body || {};

  // Membaca data Gmail otomatis dari database MongoDB bot Anda
  const gmailUser = user || req.body?.email || process.env.GMAIL_USER;
  const gmailPass = pass || req.body?.password || process.env.GMAIL_PASS;

  if (!gmailUser || !gmailPass) {
    return res.status(200).json({ success: false, error: 'Email atau Password kosong dari MongoDB!' });
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
    return res.status(200).json({ success: false, error: `Gagal Kirim Gmail: ${error.message}` });
  }
};


