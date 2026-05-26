const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
    // Penanganan CORS bawaan Vercel yang aman tanpa memicu crash fungsi
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const body = req.body || {};

        // Melacak data akun pengirim dari payload bot
        let gmailUser = body.user || body.email || body.username || (body.account && body.account.user) || (body.account && body.account.email) || process.env.GMAIL_USER;
        let gmailPass = body.pass || body.password || (body.account && body.account.pass) || (body.account && body.account.password) || process.env.GMAIL_USER_PASS;

        // Ambil data target pengiriman
        const toEmail = body.to || body.target || "email-tujuan-default@gmail.com";
        const mailSubject = body.subject || "Banding Akun";
        const mailText = body.text || `Memproses pengajuan banding otomatis untuk nomor: ${body.target || body.phone || 'Tanpa Nomor'}`;

        // Jika data dari bot kosong, kembalikan teks ramah bot agar tidak stuck
        if (!gmailUser || !gmailPass) {
            return res.status(200).json({
                success: false,
                message: "Gagal! Data akun pengirim tidak terdeteksi oleh API."
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

        // Proses Jalankan Kirim Email
        await transporter.sendMail({
            from: gmailUser.trim(),
            to: toEmail.trim(),
            subject: mailSubject,
            text: mailText
        });

        // Response Sukses yang dicari oleh skrip bot Telegram Anda
        return res.status(200).json({ 
            success: true, 
            message: 'Email Berhasil Dikirim Otomatis!' 
        });

    } catch (error) {
        // Jika SMTP Gmail menolak, tangkap error dan balikan sebagai pesan biasa agar Vercel tidak melempar error 500
        return res.status(200).json({ 
            success: false, 
            message: `Gagal Kirim Gmail: ${error.message}` 
        });
    }
};

