const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
    // Set Header agar API selalu mengembalikan format JSON dan mengizinkan akses (CORS)
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Tangani request Preflight OPTIONS dari bot jika ada
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const body = req.body || {};

        // Ambil email dari berbagai kemungkinan nama variabel yang dikirim bot
        let gmailUser = body.user || body.email || body.username || (body.account && body.account.user) || (body.account && body.account.email) || process.env.GMAIL_USER;
        
        // Ambil password / sandi aplikasi dari berbagai kemungkinan nama variabel
        let gmailPass = body.pass || body.password || (body.account && body.account.pass) || (body.account && body.account.password) || process.env.GMAIL_USER_PASS;

        // Ambil data target pengiriman
        const toEmail = body.to || body.target || "email-tujuan-default@gmail.com";
        const mailSubject = body.subject || "Banding Akun";
        const mailText = body.text || `Memproses pengajuan banding otomatis untuk nomor: ${body.target || body.phone || 'Tanpa Nomor'}`;

        // Jika data akun pengirim tetap tidak ditemukan
        if (!gmailUser || !gmailPass) {
            return res.status(200).json({
                success: false,
                message: "Gagal! Data akun pengirim (email/password) tidak terdeteksi oleh sistem API."
            });
        }

        // Konfigurasi Nodemailer Transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: gmailUser.trim(),
                pass: gmailPass.trim()
            }
        });

        // Proses Kirim Email
        await transporter.sendMail({
            from: gmailUser.trim(),
            to: toEmail.trim(),
            subject: mailSubject,
            text: mailText
        });

        // Response Sukses yang akan dibaca oleh Bot Telegram Anda
        return res.status(200).json({ 
            success: true, 
            message: 'Email Berhasil Dikirim Otomatis!' 
        });

    } catch (error) {
        // Jika terjadi error sistem atau SMTP Gmail menolak, tetap kembalikan status 200 agar Vercel tidak crash
        return res.status(200).json({ 
            success: false, 
            message: `Gagal Kirim Gmail: ${error.message}` 
        });
    }
};

