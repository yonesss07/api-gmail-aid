const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  // Menerima seluruh lemparan data dari bot Pterodactyl Anda
  const { to, subject, text, html, user, pass, email, password, account } = req.body || {};

  // TRIK UTAMA: Melacak alamat email dari segala jenis nama variabel MongoDB bot Anda
  const gmailUser = user || email || req.body?.user || req.body?.email || account?.email || process.env.GMAIL_USER;
  
  // Melacak Sandi Aplikasi dari segala jenis nama variabel MongoDB bot Anda
  const gmailPass = pass || password || req.body?.pass || req.body?.password || account?.password || account?.pass || process.env.GMAIL_PASS;

  // Jika setelah dilacak ke semua label tetap kosong, baru tampilkan error ini ke Telegram
  if (!gmailUser || !gmailPass) {
    return res.status(200).json({ 
      success: false, 
      error: `Data Kosong! Server menerima data: ${JSON.stringify(req.body)}` 
    });
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



