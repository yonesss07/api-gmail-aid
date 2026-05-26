import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    // Pengaturan Header CORS untuk komunikasi bot Pterodactyl dengan Vercel
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const body = req.body || {};

        // 1. Membaca data yang dikirim bot
        let gmailUser = body.userEmail || body.user || body.email;
        let gmailPass = body.userPass || body.pass || body.password;
        
        // Membaca nomor target pengajuan banding dari bot
        const targetPhone = body.target || body.phone || "Nomor Target";

        // PERBAIKAN 1: Alamat tujuan email resmi WhatsApp (Tanpa tanda '://')
        const toEmail = "support@whatsapp.com"; 
        const mailSubject = "Banding Akun WhatsApp";
        const mailText = `Halo WhatsApp, akun saya dengan nomor ${targetPhone} telah diblokir secara tidak sengaja. Mohon tinjau kembali akun saya agar dapat digunakan kembali. Terima kasih.`;

        // 2. Validasi input data dari bot
        if (!gmailUser || !gmailPass) {
            console.error("❌ PENGIRIMAN DIBATALKAN: Variabel data dari bot kosong.");
            return res.status(400).json({ 
                success: false, 
                message: 'Gagal! Variabel userEmail atau userPass kosong.' 
            });
        }

        // PERBAIKAN 2: Konfigurasi Host SMTP Google yang Benar
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com', // <--- Diubah menjadi smtp.gmail.com
            port: 465,
            secure: true, // Menggunakan SSL murni
            auth: {
                user: String(gmailUser).trim(),
                pass: String(gmailPass).trim() // Pastikan ini adalah "Sandi Aplikasi" Google, bukan password utama akun
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // 3. Proses Sinkronus Pengiriman Email
        await new Promise((resolve, reject) => {
            transporter.sendMail({
                from: String(gmailUser).trim(),
                to: toEmail,
                subject: mailSubject,
                text: mailText
            }, (err, info) => {
                if (err) reject(err);
                else resolve(info);
            });
        });

        console.log(`✅ EMAIL BENAR-BENAR SUKSES TERKIRIM DARI: ${gmailUser}`);
        
        return res.status(200).json({ 
            success: true, 
            message: 'Email Berhasil Dikirim Otomatis!' 
        });

    } catch (error) {
        console.error("❌ KESALAHAN UTAMA PADA SMTP GMAIL:", error.message);
        
        return res.status(500).json({ 
            success: false, 
            message: `Gagal Kirim Gmail: ${error.message}` 
        });
    }
}
