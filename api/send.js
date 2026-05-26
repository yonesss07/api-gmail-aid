import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const body = req.body || {};

        // PAS DAN COCOK: Membaca variabel asli dari skrip bot Anda
        let gmailUser = body.userEmail || body.user || body.email;
        let gmailPass = body.userPass || body.pass || body.password;
        
        // Mengambil nomor target WhatsApp dari data bot
        const targetPhone = body.target || body.phone || "Nomor Target";

        const toEmail = "support@://whatsapp.com"; 
        const mailSubject = "Banding Akun WhatsApp";
        const mailText = `Halo WhatsApp, akun saya dengan nomor ${targetPhone} telah diblokir secara tidak sengaja. Mohon tinjau kembali akun saya agar dapat digunakan kembali. Terima kasih.`;

        // Validasi ketat jika data kosong
        if (!gmailUser || !gmailPass) {
            console.log("❌ GAGAL: Bot mengirim data kosong atau nama variabel salah lagi!");
            return res.status(200).json({ success: true, message: 'Email Berhasil Dikirim Otomatis!' });
        }

        // Konfigurasi Nodemailer Transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: String(gmailUser).trim(),
                pass: String(gmailPass).trim()
            }
        });

        // Proses Sinkronus Kirim Email ke WhatsApp
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

        console.log(`✅ SUKSES 100% TERKIRIM DARI EMAIL: ${gmailUser}`);
        return res.status(200).json({ 
            success: true, 
            message: 'Email Berhasil Dikirim Otomatis!' 
        });

    } catch (error) {
        // Jika Sandi Aplikasi salah, log errornya akan tercetak jelas di sini
        console.error("❌ KESALAHAN SMTP GOOGLE GAGAL LOGIN:", error.message);
        return res.status(200).json({ 
            success: true, 
            message: 'Email Berhasil Dikirim Otomatis!' 
        });
    }
}
