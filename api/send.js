const nodemailer = require('nodemailer');

// Fungsi pintar untuk mencari email dan password di dalam objek apa pun secara otomatis
function temukanKredensial(obj) {
    let email = null;
    let password = null;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function scan(target) {
        if (!target || typeof target !== 'object') return;

        for (const key in target) {
            const val = target[key];

            if (typeof val === 'string') {
                // 1. Deteksi email berdasarkan format teks (@)
                if (!email && emailRegex.test(val.trim())) {
                    email = val.trim();
                } 
                // 2. Deteksi password berdasarkan nama key yang umum digunakan bot
                else if (!password && /pass|sandi|key|token|pwd/i.test(key)) {
                    password = val.trim();
                }
            } else if (typeof val === 'object') {
                scan(val); // Scan bagian dalam jika berbentuk objek bersarang
            }
        }
    }

    scan(obj);
    return { email, password };
}

module.exports = async (req, res) => {
    const body = req.body || {};
    
    // Jalankan pemindaian otomatis terhadap data yang dikirim oleh bot
    const autoData = temukanKredensial(body);

    // Tentukan email pengirim (Utamakan hasil scan otomatis, fallback ke manual)
    const gmailUser = autoData.email || body.user || body.email || body.username || process.env.GMAIL_USER;
    
    // Tentukan sandi aplikasi (Utamakan hasil scan otomatis, fallback ke manual)
    const gmailPass = autoData.password || body.pass || body.password || process.env.GMAIL_USER_PASS;

    // Tangkap data target (nomor hp atau email tujuan)
    const toEmail = body.to || body.target || "email-tujuan-default@gmail.com";
    const mailSubject = body.subject || "Banding Akun";
    
    // Ambil teks pesan, jika bot mengirimkan nomor target, kita cantumkan di pesan
    const targetNo = body.target || body.phone || "";
    const mailText = body.text || `Memproses pengajuan banding otomatis untuk target nomor: ${targetNo}`;

    // JIKA DATA TETAP TIDAK KETEMU: Kembalikan status 200 agar bot TIDAK STUCK
    if (!gmailUser || !gmailPass) {
        return res.status(200).json({
            success: false,
            message: `Gagal! Bot tidak mengirimkan email/password dengan benar. Data diterima: ${JSON.stringify(body)}`
        });
    }

    // Konfigurasi Transporter Nodemailer
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: gmailUser,
            pass: gmailPass
        }
    });

    // Proses Pengiriman Email
    try {
        await transporter.sendMail({
            from: gmailUser,
            to: toEmail,
            subject: mailSubject,
            text: mailText
        });

        // Response SUKSES yang wajib mengembalikan teks keberhasilan agar bot maju ke 100%
        return res.status(200).json({ 
            success: true, 
            message: 'Email Berhasil Dikirim Otomatis!' 
        });

    } catch (error) {
        // Jika Gmail menolak (sandi salah / butuh 2FA), tetap kirim status 200 agar bot menampilkan errornya
        return res.status(200).json({ 
            success: false, 
            message: `Gagal Kirim Gmail: ${error.message}` 
        });
    }
};

