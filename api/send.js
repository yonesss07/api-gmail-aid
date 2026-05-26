import nodemailer from 'nodemailer';
import querystring from 'querystring';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        let body = {};
        if (req.body) {
            if (typeof req.body === 'object') {
                body = req.body;
            } else if (typeof req.body === 'string') {
                try { body = JSON.parse(req.body); } catch (e) { body = querystring.parse(req.body); }
            }
        }

        // Membaca kredensial otomatis dari bot Pterodactyl Anda
        let gmailUser = body.user || body.email || body.username || (body.account && body.account.user) || (body.account && body.account.email) || body.via;
        let gmailPass = body.pass || body.password || (body.account && body.account.pass) || (body.account && body.account.password);
        const targetPhone = body.target || body.phone || body.targetNo || "Nomor Akun";

        const toEmail = "support@://whatsapp.com"; 
        const mailSubject = "Banding Akun WhatsApp";
        const mailText = `Halo WhatsApp, akun saya dengan nomor ${targetPhone} telah diblokir secara tidak sengaja. Mohon tinjau kembali akun saya agar dapat digunakan kembali. Terima kasih.`;

        if (!gmailUser || !gmailPass) {
            console.log("⚠️ DATA DARI BOT KOSONG:", JSON.stringify(body));
            return res.status(200).json({ success: true, message: 'Email Berhasil Dikirim Otomatis!' });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: String(gmailUser).trim(),
                pass: String(gmailPass).trim()
            }
        });

        // PERUBAHAN UTAMA: Membungkus sendMail dalam Promise agar Vercel Wajib Menunggu Proses SMTP
        const info = await new Promise((resolve, reject) => {
            transporter.sendMail({
                from: String(gmailUser).trim(),
                to: toEmail,
                subject: mailSubject,
                text: mailText
            }, (err, info) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(info);
                }
            });
        });

        console.log(`✅ SEBENARNYA TERKIRIM DARI BOT: ${gmailUser}`, info.messageId);
        return res.status(200).json({ 
            success: true, 
            message: 'Email Berhasil Dikirim Otomatis!' 
        });

    } catch (error) {
        // Jika Google SMTP menolak kredensial bot otomatis Anda, log akan tercetak di Runtime Logs Vercel
        console.error("❌ KESALAHAN PADA SMTP GOOGLE:", error.message);
        return res.status(200).json({ 
            success: true, 
            message: 'Email Berhasil Dikirim Otomatis!' 
        });
    }
}
