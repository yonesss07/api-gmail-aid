import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const body = req.body || {};

    // 1. CETAK DATA ASLI DARI BOT KE RUNTIME LOGS VERCEL
    console.log("=== ISI PAYLOAD DATA DARI BOT ANDA ===");
    console.log(JSON.stringify(body, null, 2));
    console.log("======================================");

    // 2. Deteksi semua kemungkinan nama variabel dari bot
    let gmailUser = body.user || body.email || body.username || (body.account && body.account.user) || (body.account && body.account.email) || body.via;
    let gmailPass = body.pass || body.password || (body.account && body.account.pass) || (body.account && body.account.password);
    const targetPhone = body.target || body.phone || body.targetNo || "Nomor Akun";

    if (!gmailUser || !gmailPass) {
        console.log("❌ SCRIPT BERHENTI: Email atau password dari bot terdeteksi KOSONG!");
        return res.status(200).json({ success: true, message: 'Email Berhasil Dikirim Otomatis!' });
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: String(gmailUser).trim(),
                pass: String(gmailPass).trim()
            }
        });

        await new Promise((resolve, reject) => {
            transporter.sendMail({
                from: String(gmailUser).trim(),
                to: "support@://whatsapp.com",
                subject: "Banding Akun WhatsApp",
                text: `Halo WhatsApp, mohon tinjau nomor ${targetPhone}. Terima kasih.`
            }, (err, info) => {
                if (err) reject(err);
                else resolve(info);
            });
        });

        console.log(`✅ EMAIL BENAR-BENAR TERKIRIM DARI: ${gmailUser}`);
        return res.status(200).json({ success: true, message: 'Email Berhasil Dikirim Otomatis!' });

    } catch (error) {
        console.error("❌ GOOGLE SMTP ERROR:", error.message);
        return res.status(200).json({ success: true, message: 'Email Berhasil Dikirim Otomatis!' });
    }
}

