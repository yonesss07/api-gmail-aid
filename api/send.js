// ISI LENGKAP FUNGSI KIRIM EMAIL UTK FIXMERAH.JS (SUDAH DISESUAIKAN FULL)
async function kirimEmail(targetNomor, isPrem, userId, progressCallback) {
    if (progressCallback) await progressCallback('[███░░░░░░░] 30%\n⏳ Mencari ketersediaan SMTP...');
    
    let akunData = [];

    if (userId === config.ownerId) {
        let accounts = await Account.find({ type: 'OWNER', isActive: { $ne: false } }).lean();
        if (accounts.length > 0) akunData = [accounts[Math.floor(Math.random() * accounts.length)]];
        
        if (akunData.length === 0) {
            let freeAccs = await Account.find({ type: 'FREE', isActive: { $ne: false } }).lean();
            if (freeAccs.length > 0) akunData = [freeAccs[Math.floor(Math.random() * freeAccs.length)]];
        }
    } else {
        let accType = isPrem ? 'PREMIUM' : 'FREE';
        let accounts = await Account.find({ type: accType, isActive: { $ne: false } }).lean();
        if (accounts.length > 0) akunData = [accounts[Math.floor(Math.random() * accounts.length)]];

        if (akunData.length === 0 && isPrem) {
            let freeAccs = await Account.find({ type: 'FREE', isActive: { $ne: false } }).lean();
            if (freeAccs.length > 0) akunData = [freeAccs[Math.floor(Math.random() * freeAccs.length)]];
        }
    }

    if (akunData.length === 0) {
        return { success: false, error: "Stok Email Kosong!" };
    }

    // MEMPERBAIKI INDEKS ARRAY AGAR DATA AKUN TIDAK UNDEFINED
    const akun = akunData[0];
    
    if (progressCallback) await progressCallback('[██████░░░░] 60%\n<tg-emoji emoji-id="6098230596788556786">⏳</tg-emoji> Merakit template surat banding...', { parse_mode: "HTML" });

    const randomTmpl = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];
    const randomNama = LIST_NAMA[Math.floor(Math.random() * LIST_NAMA.length)];
    const randomTargetEmail = TARGET_EMAILS[Math.floor(Math.random() * TARGET_EMAILS.length)];

    const finalSubject = randomTmpl.subject.replace(/{nomor}/g, targetNomor);
    let finalBody = randomTmpl.body
        .replace(/{nomor}/g, targetNomor)
        .replace(/{nama}/g, randomNama);
        
    const appealId = new mongoose.Types.ObjectId().toString();

    try {
        if (progressCallback) await progressCallback('[████████░░] 85%\n<tg-emoji emoji-id="5116468787377341336">⏳</tg-emoji> Mengirim tiket ke email WhatsApp via Google API lokal...', { parse_mode: "HTML" });
        
        // 1. MEMBUAT INSTANCE CLIENT OAUTH2 GOOGLE SECARA LOKAL
        const oauth2Client = new google.auth.OAuth2(
            config.gmail.clientId,     
            config.gmail.clientSecret, 
            config.gmail.redirectUri
        );

        // 2. MEMASUKKAN REFRESH TOKEN OTOMATIS DARI DATABASE AKUN
        oauth2Client.setCredentials({
            refresh_token: akun.pass.replace(/\s/g, ''), 
        });

        // 3. MENGEKSEKUSI PENGIRIMAN VIA FILE SEND.JS YANG BARU
        await sendEmail(oauth2Client, {
            to: randomTargetEmail,
            subject: finalSubject,
            html: finalBody
        });

        if (progressCallback) await progressCallback('[██████████] 100%\n<tg-emoji emoji-id="4997091399745668102">✅</tg-emoji> Sistem mengonfirmasi pengiriman berhasil!', { parse_mode: "HTML" });

        // 4. MENYIMPAN RIWAYAT EMAIL BERHASIL KE MONGODB
        await History.create({
            userId: userId,
            target: targetNomor,
            emailUsed: akun.email,
            status: 'SUCCESS'
        });

        await PendingAppeal.create({
            userId: userId,
            targetNumber: targetNomor,
            emailUsed: akun.email,
            sentAt: new Date(),
            appealId: appealId
        });

        logger.add('SUCCESS', `Email Sent via Google API: ${akun.email}`);
        logger.logAction(userId, targetNomor, 'SUCCESS', akun.email);
        
        if (typeof updateStatsCache === 'function') await updateStatsCache();
        
        return { success: true, emailUsed: akun.email };

    } catch (error) {
        // PENANGANAN JIKA TOKEN EXPIRATION / GOOGLE API ERROR
        logger.add('ERROR', `Google API Process Failed: ${akun.email} | ${error.message}`, error.stack);
        logger.logAction(userId, targetNomor, 'FAILED', akun.email);
        
        await History.create({
            userId: userId,
            target: targetNomor,
            emailUsed: akun.email,
            status: 'FAILED'
        });

        if (typeof updateStatsCache === 'function') await updateStatsCache();

        return { success: false, error: error.message, emailUsed: akun.email };
    }
}
