const Imap = require('imap');
const { simpleParser } = require('mailparser');
const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const body = req.body || {};
    const gmailUser = body.userEmail || body.email;
    const gmailPass = body.userPass || body.pass;
    const telegramChatId = body.chatId; // ID Chat Telegram user Anda
    const botToken = body.botToken;     // Token Bot Telegram Anda untuk kirim jawaban

    if (!gmailUser || !gmailPass || !telegramChatId || !botToken) {
        return res.status(400).json({ success: false, message: 'Parameter cek email tidak lengkap.' });
    }

    const imap = new Imap({
        user: String(gmailUser).trim(),
        password: String(gmailPass).trim(),
        host: '://gmail.com',
        port: 993,
        tls: true,
        tlsOptions: { rejectUnauthorized: false }
    });

    function openInbox(cb) {
        imap.openBox('INBOX', false, cb);
    }

    imap.once('ready', () => {
        openInbox((err, box) => {
            if (err) { imap.end(); return res.status(500).json({ success: false, error: err.message }); }
            
            // Mencari email belum terbaca UNSEEN dari domain whatsapp.com
            imap.search([ 'UNSEEN', ['FROM', 'whatsapp.com'] ], (err, results) => {
                if (err || !results.length) {
                    imap.end();
                    return res.status(200).json({ success: true, message: 'Belum ada email balasan baru dari WhatsApp.' });
                }

                // Ambil email terbaru
                const f = imap.fetch(results[results.length - 1], { bodies: '' });
                
                f.on('message', (msg) => {
                    msg.on('body', async (stream) => {
                        try {
                            const parsed = await simpleParser(stream);
                            const textBalasan = parsed.text || "Gagal mengekstrak isi teks email.";
                            const pengirim = parsed.from.text;

                            // Kirim pesan teks balasan secara otomatis ke Chat Telegram pengguna
                            const infoPesan = `📩 *ADA BALASAN OTOMATIS DARI WHATSAPP!*\n\n*Dari:* ${pengirim}\n\n*Isi Pesan:*\n${textBalasan.substring(0, 3000)}`;
                            
                            await axios.post(`https://telegram.org{botToken}/sendMessage`, {
                                chat_id: telegramChatId,
                                text: infoPesan,
                                parse_mode: 'Markdown'
                            });

                            // Tandai email sudah terbaca agar tidak dikirim berulang kali ke bot
                            imap.addFlags(results[results.length - 1], '\\Seen', () => {});
                        } catch (e) {
                            console.error(e);
                        }
                    });
                });

                f.once('end', () => { imap.end(); return res.status(200).json({ success: true, message: 'Balasan WhatsApp berhasil diteruskan ke bot.' }); });
            });
        });
    });

    imap.once('error', (err) => { return res.status(500).json({ success: false, message: err.message }); });
    imap.once('end', () => {});
    imap.connect();
};

