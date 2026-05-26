const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  // 1. Sistem Keamanan Pengaman URL Anda
  const incomingKey = req.headers['x-api-key'] || req.query.key || req.body?.key;
  if (incomingKey !== 'AIDGANS') { 
    return res.status(403).json({ success: false, error: 'Akses Ditolak: Kunci API Salah!' });
  }

  const { to, subject, text, html } = req.body || {};

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  });

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to,
      subject,
      text,
      html
    });

    return res.status(200).json({ success: true, message: 'Email Berhasil Dikirim!' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
