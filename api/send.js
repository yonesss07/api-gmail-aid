const nodemailer = require('nodemailer');

// DAFTAR EMAIL TARGET WHATSAPP RESMI SAMA SEPERTI DI BOT ANDA
const TARGET_EMAILS = [
    "support@://whatsapp.com", "support@whatsapp.com", "help@://whatsapp.com",
    "questions@://whatsapp.com", "contact@://whatsapp.com", "info@://whatsapp.com",
    "helpdesk@://whatsapp.com", "cs@://whatsapp.com", "appeal@://whatsapp.com",
    "review@://whatsapp.com", "unban@://whatsapp.com", "spam@://whatsapp.com"
];

module.exports = async (req, res) => {
    // Pengaturan Header CORS agar bot Pterodactyl Anda lancar berkomunikasi
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const body = req.body || {};

        // Menangkap data kredensial dari bot panel Anda
        const gmailUser = body.userEmail || body.email;
        const gmailPass = body.userPass || body.pass;
        const targetNomor = body.target || "Nomor Target";

        // Mengambil template subject & body langsung dari bot Anda
        const finalSubject = body.subject || `Banding Akun WhatsApp [Ref: ${targetNomor}]`;
        const finalBody = body.htmlBody || body.body || `Halo WhatsApp, mohon tinjau nomor ${targetNomor}.`;

        // Sistem mengacak email target tujuan secara internal persis seperti logika bot Anda
        const randomTargetEmail = TARGET_EMAILS[Math.floor(Math.random() * TARGET_EMAILS.length)];

        // Validasi data input darurat
        if (!gmailUser || !gmailPass) {
            return res.status(400).json({ success: false, message: 'Gagal! Variabel email atau sandi aplikasi kosong.' });
        }

        // Konfigurasi SMTP Gmail Resmi
        const transporter = nodemailer.createTransport({
            host: ':/gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: String(gmailUser).trim(),
                pass: String(gmailPass).trim() // Pastikan ini Sandi Aplikasi 16 digit Anda
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // Kirim Email Ke Target Acak WhatsApp
        await transporter.sendMail({
            from: String(gmailUser).trim(),
            to: randomTargetEmail,
            subject: finalSubject,
            html: finalBody
        });

        // Mengembalikan respons sukses asli agar bot Telegram Anda memberikan notifikasi centang hijau
        return res.status(200).json({ 
            success: true, 
            message: 'Email Berhasil Dikirim Otomatis!',
            sentTo: randomTargetEmail
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

