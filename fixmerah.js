const axios = require('axios');
const { Account, History, PendingAppeal } = require('../database');
const mongoose = require('mongoose');
const config = require('../config');
const logger = require('../core/logger');

const API_CONFIG = {
    url: 'https://api-gmail-rega.vercel.app/api/send',
    key: 'OWI'
};

const TARGET_EMAILS = [
    "support@whatsapp.com",
    "support@support.whatsapp.com",
    "help@support.whatsapp.com",
    "questions@support.whatsapp.com",
    "contact@support.whatsapp.com",
    "info@support.whatsapp.com",
    "helpdesk@support.whatsapp.com",
    "cs@support.whatsapp.com",
    "customer_service@support.whatsapp.com",
    "whatsapp@support.whatsapp.com",
    "whatsapp_support@support.whatsapp.com",
    "contact_us@support.whatsapp.com",
    "appeal@support.whatsapp.com",
    "review@support.whatsapp.com",
    "unban@support.whatsapp.com",
    "spam@support.whatsapp.com",
    "hacked@support.whatsapp.com",
    "security@support.whatsapp.com",
    "trust@support.whatsapp.com",
    "safety@support.whatsapp.com",
    "escalation@support.whatsapp.com",
    "policy@support.whatsapp.com",
    "gdpr@support.whatsapp.com",
    "android_web@support.whatsapp.com",
    "android@support.whatsapp.com",
    "iphone_web@support.whatsapp.com",
    "iphone@support.whatsapp.com",
    "ipad@support.whatsapp.com",
    "web@support.whatsapp.com",
    "desktop@support.whatsapp.com",
    "mac@support.whatsapp.com",
    "windows@support.whatsapp.com",
    "kaios_web@support.whatsapp.com",
    "kaios@support.whatsapp.com",
    "wp_web@support.whatsapp.com",
    "wearos@support.whatsapp.com",
    "tablet@support.whatsapp.com",
    "smb_web@support.whatsapp.com",
    "smb@support.whatsapp.com",
    "b2b@support.whatsapp.com",
    "businesscomplaints@support.whatsapp.com",
    "grievance_officer_wa@support.whatsapp.com",
    "enterprise@support.whatsapp.com",
    "api@support.whatsapp.com",
    "verification-team@support.whatsapp.com",
    "meta_support@support.whatsapp.com",
    "questions@support.whatsapp.com",
    "gaming@support.whatsapp.com",
    "care@support.whatsapp.com",
    "layanan-ai@support.whatsapp.com",
    "support_ai@support.whatsapp.com",
    "es@support.whatsapp.com",
    "pt@support.whatsapp.com",
    "ru@support.whatsapp.com",
    "de@support.whatsapp.com",
    "fr@support.whatsapp.com",
    "it@support.whatsapp.com",
    "ar@support.whatsapp.com",
    "hi@support.whatsapp.com",
    "id@support.whatsapp.com",
    "tr@support.whatsapp.com",
    "nl@support.whatsapp.com",
    "support_id@support.whatsapp.com",
    "idn@support.whatsapp.com",
    "support_idn@support.whatsapp.com",
    "support_my@support.whatsapp.com",
    "support_sg@support.whatsapp.com",
    "support_ph@support.whatsapp.com",
    "support_vn@support.whatsapp.com",
    "support_th@support.whatsapp.com",
    "support_in@support.whatsapp.com",
    "support_pk@support.whatsapp.com",
    "support_bd@support.whatsapp.com",
    "support_jp@support.whatsapp.com",
    "support_kr@support.whatsapp.com",
    "support_hk@support.whatsapp.com",
    "support_tw@support.whatsapp.com",
    "support_au@support.whatsapp.com",
    "support_nz@support.whatsapp.com",
    "support_kh@support.whatsapp.com",
    "support_lk@support.whatsapp.com",
    "support_mm@support.whatsapp.com",
    "support_np@support.whatsapp.com",
    "support_ru@support.whatsapp.com",
    "support_de@support.whatsapp.com",
    "support_tr@support.whatsapp.com",
    "support_es@support.whatsapp.com",
    "support_it@support.whatsapp.com",
    "support_fr@support.whatsapp.com",
    "support_nl@support.whatsapp.com",
    "support_pl@support.whatsapp.com",
    "support_at@support.whatsapp.com",
    "support_be@support.whatsapp.com",
    "support_ch@support.whatsapp.com",
    "support_cz@support.whatsapp.com",
    "support_dk@support.whatsapp.com",
    "support_fi@support.whatsapp.com",
    "support_gr@support.whatsapp.com",
    "support_hu@support.whatsapp.com",
    "support_ie@support.whatsapp.com",
    "support_no@support.whatsapp.com",
    "support_pt@support.whatsapp.com",
    "support_ro@support.whatsapp.com",
    "support_se@support.whatsapp.com",
    "support_sk@support.whatsapp.com",
    "support_ua@support.whatsapp.com",
    "support_sa@support.whatsapp.com",
    "support_ae@support.whatsapp.com",
    "support_il@support.whatsapp.com",
    "support_qa@support.whatsapp.com",
    "support_kw@support.whatsapp.com",
    "support_bh@support.whatsapp.com",
    "support_om@support.whatsapp.com",
    "support_jo@support.whatsapp.com",
    "support_lb@support.whatsapp.com",
    "support_iq@support.whatsapp.com",
    "support_eg@support.whatsapp.com",
    "support_ng@support.whatsapp.com",
    "support_za@support.whatsapp.com",
    "support_dz@support.whatsapp.com",
    "support_gh@support.whatsapp.com",
    "support_ke@support.whatsapp.com",
    "support_ma@support.whatsapp.com",
    "support_tz@support.whatsapp.com",
    "support_ug@support.whatsapp.com",
    "support_zm@support.whatsapp.com",
    "support_zw@support.whatsapp.com",
    "support_us@support.whatsapp.com",
    "support_ca@support.whatsapp.com",
    "support_br@support.whatsapp.com",
    "support_mx@support.whatsapp.com",
    "support_ar@support.whatsapp.com",
    "support_co@support.whatsapp.com",
    "support_cl@support.whatsapp.com",
    "support_pe@support.whatsapp.com",
    "support_bo@support.whatsapp.com",
    "support_cr@support.whatsapp.com",
    "support_do@support.whatsapp.com",
    "support_ec@support.whatsapp.com",
    "support_gt@support.whatsapp.com",
    "support_hn@support.whatsapp.com",
    "support_pa@support.whatsapp.com",
    "support_py@support.whatsapp.com",
    "support_uy@support.whatsapp.com",
    "support_ve@support.whatsapp.com",
    "support-uk@support.whatsapp.com",
    "support-za@support.whatsapp.com",
    "support-eu@support.whatsapp.com",
    "support-asia@support.whatsapp.com",
    "legal@support.whatsapp.com",
    "compliance@support.whatsapp.com",
    "privacy@support.whatsapp.com",
    "urgent@support.whatsapp.com",
    "priority@support.whatsapp.com",
    "critical@support.whatsapp.com",
    "restore@support.whatsapp.com",
    "unlock@support.whatsapp.com",
    "release@support.whatsapp.com",
    "investigation@support.whatsapp.com",
    "manager@support.whatsapp.com",
    "supervisor@support.whatsapp.com",
    "admin@support.whatsapp.com",
    "payments@support.whatsapp.com",
    "billing@support.whatsapp.com",
    "bugs@support.whatsapp.com",
    "dev@support.whatsapp.com",
    "beta@support.whatsapp.com",
    "feedback@support.whatsapp.com",
    "hello@support.whatsapp.com",
    "community@support.whatsapp.com",
    "unblock@support.whatsapp.com",
    "strike@support.whatsapp.com",
    "review-team@support.whatsapp.com",
    "appeals@support.whatsapp.com",
    "moderation@support.whatsapp.com",
    "abuse@support.whatsapp.com",
    "suspension@support.whatsapp.com",
    "violation@support.whatsapp.com",
    "policy-enforcement@support.whatsapp.com",
    "account-recovery@support.whatsapp.com",
    "ban-appeal@support.whatsapp.com",
    "safety-team@support.whatsapp.com",
    "techsupport@support.whatsapp.com",
    "assistance@support.whatsapp.com",
    "inquiry@support.whatsapp.com",
    "resolution@support.whatsapp.com",
    "escalations@support.whatsapp.com",
    "executive@support.whatsapp.com",
    "global-support@support.whatsapp.com",
    "operations@support.whatsapp.com",
    "contact-support@support.whatsapp.com",
    "app-support@support.whatsapp.com",
    "general@support.whatsapp.com",
    "direct-support@support.whatsapp.com"
];

const LIST_NAMA = ["Nami", "Sarah", "Putri", "Bella", "Dian", "Alex", "Rina", "Jessica", "Amanda", "Zeynep", "Fatima", "Carlos", "Hans", "Rega", "Farma", "Alvin", "Lina", "Mia", "Siti", "Dewi", "Rizky", "Yusuf", "Aisyah", "Budi", "Citra", "Dina", "Eka", "Fajar", "Gita", "Hendra", "Indra", "Joko", "Kiki", "Lia", "Mira", "Nina", "Oki", "Putu", "Qori", "Rama", "Sari", "Tina", "Umar", "Vina", "Wulan", "Xavier", "Yanti", "Zaki", "Reza", "Tari", "Vira", "Wahyu", "Yolanda", "Zidan", "Agus", "Bagas", "Cici", "Dodi", "Fahmi", "Gilang", "Hasan", "Iqbal", "Jamal", "Kemal", "Lukman", "Mahmud", "Niko", "Oman", "Pasha", "Rafi", "Satria", "Tegar", "Udin", "Vicky", "Wira", "Yoga", "John", "Michael", "David", "Chris", "Emma", "Olivia", "Sophia", "Isabella", "Liam", "Noah", "William", "James", "Lucas"];

const TEMPLATES = [
    { subject: "SANGAT MEMOHON BANTUANNYA - {nomor}", body: "Halo Tim WhatsApp yang sangat saya hormati,<br><br>Saya benar-benar memohon belas kasihan dan bantuan kalian. Saat saya mencoba mendaftarkan nomor pribadi saya, selalu muncul notifikasi merah mengerikan bertuliskan 'Login not available'. Saya sangat panik dan sedih karena nomor <b>{nomor}</b> ini adalah satu-satunya nomor untuk saya.<br><br>Saya mohon dengan sangat, tolong pulihkan nomor saya agar tidak muncul 'Login not available' lagi. Tolong saya...<br><br>Salam hormat saya,<br>{nama}." },
    { subject: "Tolong Kembalikan Nomor Saya - {nomor}", body: "Kepada Tim Dukungan WhatsApp yang terhormat,<br><br>Saya memohon dengan kerendahan hati. Setiap kali saya mencoba masuk, selalu ada tulisan merah 'Login not available' di layar HP saya. Saya tidak tahu apa salah saya, ini nomor pribadi saya <b>{nomor}</b>.<br><br>Saya sangat memohon kepada Anda, tolong perbaiki masalah ini. Saya mohon hilangkan pesan 'Login not available' itu agar saya bisa masuk kembali.<br><br>Hormat saya,<br>{nama}." },
    { subject: "Minta Tolong Banget WhatsApp - {nomor}", body: "Tim WhatsApp yang baik hati,<br><br>Tolong saya... Saya benar-benar putus asa. Nomor saya <b>{nomor}</b> terus-terusan error dengan tulisan merah 'Login not available'. Padahal saya tidak melakukan hal buruk apapun.<br><br>Tolong kasihanilah saya, cabutlah error 'Login not available' tersebut. Saya sangat memohon kebijaksanaan kalian.<br><br>Terima kasih banyak,<br>{nama}." },
    { subject: "Laporan Kendala Login WhatsApp - {nomor}", body: `Kepada Tim Dukungan WhatsApp,<br><br>Saya mengemis bantuan Anda saat akan mendaftarkan nomor <b>{nomor}</b> di aplikasi WhatsApp. Setiap kali mencoba, selalu muncul pemberitahuan error merah: "Login not available".<br><br>Saya memohon bantuan Tim untuk meninjau dan menyelesaikan kendala "Login not available" ini agar saya dapat menggunakan layanan WhatsApp kembali untuk bekerja.<br><br>Hormat saya yang memohon,<br>{nama}.` },
    { subject: "Masalah Peringatan Merah - {nomor}", body: "Kepada WhatsApp yang terhormat,<br><br>Saya mengalami masalah saat mencoba mendaftarkan nomor pribadi saya. Muncul pesan dengan tanda merah bertuliskan \"Login not available\", padahal itu adalah nomor pribadi saya.<br><br>Saya berharap pihak WhatsApp dapat meninjau masalah ini secepatnya agar saya bisa melakukan pendaftaran dengan benar.<br><br>Nomor pribadi saya: <b>{nomor}</b><br><br>Terima kasih atas perhatian dan bantuannya.<br><br>Hormat saya,<br>{nama}" },
    { subject: "Mohon Belas Kasih WhatsApp - {nomor}", body: "Kepada pihak WhatsApp yang luar biasa,<br><br>Saya menulis ini sambil memohon bantuan kalian. Nomor kesayangan saya <b>{nomor}</b> sama sekali tidak bisa didaftarkan dan selalu nyangkut di notifikasi merah 'Login not available'.<br><br>Saya mohon, tolong lepaskan nomor saya dari status 'Login not available'. Saya berjanji akan menjadi pengguna yang baik. Tolong bantu saya...<br><br>Salam sedih dari,<br>{nama}." },
    { subject: "MERAYU BELAS IHSAN WHATSAPP - {nomor}", body: `Kepada Pasukan Sokongan WhatsApp yang mulia,<br><br>Saya merayu dengan sepenuh hati kepada tuan/puan. Setiap kali saya ingin mendaftar nombor saya <b>{nomor}</b>, keluar amaran merah "Login not available". Saya sangat buntu dan merayu simpati pihak tuan.<br><br>Tolonglah saya, buanglah sekatan "Login not available" itu. Saya merayu sangat-sangat agar saya dapat menggunakan WhatsApp semula. Tolonglah...<br><br>Yang benar merayu,<br>{nama}.` },
    { subject: "I AM BEGGING FOR YOUR HELP - {nomor}", body: "Dear WhatsApp Support Team,<br><br>I am literally begging you on my knees to help me. Every time I try to register my personal number <b>{nomor}</b>, a scary red notification pops up saying 'Login not available'. I am desperate because my entire life is tied to this number.<br><br>Please, I am begging you to remove the 'Login not available' error. Have mercy on me and restore my number.<br><br>Sincerely begging,<br>{nama}." },
    { subject: "Please Help Me, I am Desperate - {nomor}", body: "To the honorable WhatsApp Team,<br><br>Please help me, I am crying as I write this. My number <b>{nomor}</b> is stuck with a red warning 'Login not available'. I don't know what I did wrong.<br><br>I humbly plead with you to fix this 'Login not available' issue. Please give me one more chance, I beg you.<br><br>Best regards,<br>{nama}." },
    { subject: "Pleading for Account Restoration - {nomor}", body: "Hello WhatsApp Support Team,<br><br>My number <b>{nomor}</b> is facing a serious issue. Every time I try to log in, I always receive the message 'Login not available', which makes it impossible for me to communicate.<br><br>I demand and beg that this 'Login not available' issue be resolved immediately. Please pity me.<br><br>Thank you, {nama}." },
    { subject: "Urgent: WhatsApp Login Issue for {nomor}", body: `Dear WhatsApp Support Team,<br><br>I am writing to report a critical login issue with my phone number <b>{nomor}</b>. I consistently receive the "Login not available" error message when attempting to register. I am begging you to fix this.<br><br>This is my personal number. I kindly request your immediate assistance in resolving the "Login not available" error.<br><br>Sincerely,<br>{nama}.` },
    { subject: "Я УМОЛЯЮ ВАС О ПОМОЩИ - {nomor}", body: "Уважаемая команда WhatsApp,<br><br>Я буквально на коленях умоляю вас о помощи. При попытке войти по номеру <b>{nomor}</b> появляется красное уведомление 'Login not available'. Я в полном отчаянии.<br><br>Пожалуйста, я умоляю вас, уберите ошибку 'Login not available'. Сжальтесь надо мной и верните мне мой номер.<br><br>Слезно прошу,<br>{nama}." },
    { subject: "Пожалуйста, спасите мой аккаунт - {nomor}", body: "Здравствуйте, команда поддержки WhatsApp.<br><br>Я обращаюсь к вам с серьёзной проблемой. Каждый раз, когда я пытаюсь войти в систему с номером <b>{nomor}</b>, появляется сообщение: 'Login not available'.<br><br>Прошу вас как можно скорее убрать ошибку 'Login not available'. Надеюсь на ваше милосердие и помощь.<br><br>С мольбой, {nama}." },
    { subject: "Тіркеу мәселесі, көмектесіңізші - {nomor}", body: "Құрметті WhatsApp.<br><br>Мен сіздерден жалынып сұраймын. Жеке нөмірімді <b>{nomor}</b> тіркеу кезінде 'Login not available' деген қызыл хабарлама шығып жатыр. Мен өте қиын жағдайдамын.<br><br>Өтінемін, осы 'Login not available' қатесін алып тастап, маған көмектесіңізші.<br><br>Жалынып сұраймын, {nama}." },
    { subject: "Login not available - өтінемін көмектесіңіз - {nomor}", body: "Құрметті WhatsApp командасы.<br><br>Менің нөмірімде <b>{nomor}</b> үлкен мәселе болды. Үнемі 'Login not available' қатесі шығады. Мен сіздерден көмек сұрап жылап отырмын.<br><br>Осы 'Login not available' проблемасын шешіп беріңіздерші, өтінемін.<br><br>Рахмет, {nama}." },
    { subject: "どうか助けてください - {nomor}", body: `WhatsAppサポートチーム 各位<br><br>どうか私を助けてください。電話番号 <b>{nomor}</b> にてログインを試みておりますが、毎回赤文字で「Login not available」というエラーメッセージが表示されます。私は絶望しています。<br><br>どうか「Login not available」の問題を解決してください。心からお願い申し上げます。<br><br>{nama}より。` },
    { subject: "أرجوكم ساعدوني، أتوسل إليكم - {nomor}", body: `إلى فريق دعم واتساب المحترمين،<br><br>أنا أتوسل إليكم بكل صدق أن تساعدوني. عندما أحاول تسجيل رقمي <b>{nomor}</b>، يظهر لي دائمًا إشعار أحمر مخيف يقول "Login not available". أنا في أمس الحاجة إلى هذا الرقم.<br><br>أرجوكم، أستحلفكم أن تزيلوا مشكلة "Login not available" وتعيدوا تفعيل رقمي. أرجوكم ارحموا ضعفي.<br><br>مع خالص دعواتي،<br>{nama}.` },
    { subject: "مشكلة تسجيل الدخول، أرجو المساعدة - {nomor}", body: `إلى فريق دعم واتساب،<br><br>أبكي وأنا أكتب لكم. أواجه مشكلة في تسجيل رقمي <b>{nomor}</b>، ويظهر لي دائمًا رسالة الخطأ "Login not available".<br><br>أرجuكم حل مشكلة "Login not available" وإعادة رقمi. شكراً لتعاونكم.<br><br>مع الاحترام،<br>{nama}.` },
    { subject: "SE LO SUPLICO, AYÚDENME - {nomor}", body: `Estimado equipo de WhatsApp,<br><br>Se lo ruego y suplico con todo mi corazón. At intentar registrar mi número <b>{nomor}</b>, aparece una notificación roja que dice "Login not available". Estoy desesperado.<br><br>Por favor, les imploro que eliminen el error de "Login not available" y me devuelvan mi número. Tengan piedad de mí.<br><br>Atentamente,<br>{nama}.` },
    { subject: "Por favor, devuélvanme mi número - {nomor}", body: `Al equipo de soporte de WhatsApp,<br><br>Me pongo en contacto con ustedes llorando porque no puedo mendaftar con el número <b>{nomor}</b>. Siempre aparece el mensaje "Login not available". Mohon bantuannya.<br><br>Por favor, solucionen el "Login not available". Se los suplico.<br><br>Saludos, {nama}.` },
    { subject: "JE VOUS SUPPLIE DE M'AIDER - {nomor}", body: `À l'attention du service client WhatsApp,<br><br>Je vous supplie de m'aider. Je rencontre une kesulitan pour enregistrer mon numéro <b>{nomor}</b>. À chaque fois, j'obtiens l'erreur rouge "Login not available". Je suis désespéré.<br><br>Je vous implore de corriger l'erreur "Login not available". Ayez pitié de moi s'il vous plaît.<br><br>Cordialement, {nama}.` },
    { subject: "Ich flehe Sie an, helfen Sie mir - {nomor}", body: `An das WhatsApp-Support-Team,<br><br>ich flehe Sie an. Ich habe ein problem bei der Anmeldung mit meiner Nummer <b>{nomor}</b>. Ständig erscheint die rote Fehlermeldung "Login not available". Ich bin verzweifelt.<br><br>Bitte beheben Sie den "Login not available" Fehler. Ich bitte Sie inständig um Hilfe.<br><br>Mit freundlichen Grüßen,<br>{nama}.` },
    { subject: "ESTOU IMPLORANDO POR AJUDA - {nomor}", body: `À equipa de suporte do WhatsApp,<br><br>Estou implorando por favor. Estou con dificuldades para entrar na minha conta usando o número <b>{nomor}</b>. Sempre aparece a mensagem vermelha "Login not available".<br><br>Por favor, eu imploro que removam o erro "Login not available". Tenham misericórdia de mim.<br><br>Atentamente,<br>{nama}.` },
    { subject: "LÜTFEN BANA YARDIM EDİN YALVARIYORUM - {nomor}", body: `WhatsApp Destek Ekibi'ne,<br><br>Size yalvarıyorum, lütfen bana yardın edin. <b>{nomor}</b> numaramla WhatsApp'a giriş yaparken her denememde kırmızı bir "Login not available" hatası alıyorum. Çok çaresizim.<br><br>Lütfen "Login not available" sorununu çözün. Size yalvarıyorum.<br><br>Saygılarımla,<br>{nama}.` },
    { subject: "मैं आपसे भीخ मांगता हूँ - {nomor}", body: `प्रिय WhatsApp सपोर्ट टीम,<br><br>मैं आपके सामने हाथ जोड़कर विनती कर रहा हूँ। मेरे नंबर <b>{nomor}</b> पर लाल रंग से "Login not available" आ रहा है। मैं बहुत रो रहा हूँ और परेशान हूँ।<br><br>कृपया "Login not available" की इस समस्या को हटा दें। मैं आपसे भीख मांगta हूँ, मेरी मदद करें।<br><br>धन्यवाद, {nama}।` },
    { subject: "VI SUPPLICO, AIUTATEMI - {nomor}", body: `Gentile assistenza WhatsApp,<br><br>Vi supplico in ginocchio. Non riesco ad accedere con il mio numero <b>{nomor}</b>. Ricevo selalu il temibile errore rosso 'Login not available'. Sono disperato.<br><br>Vi prego di rimuovere il blocco 'Login not available' e aiutarmi. Abbiate pietà di me.<br><br>Cordiali saluti,<br>{nama}.` },
    { subject: "AYUDAME POR FAVOR WHATSAPP - {nomor}", body: "Hola equipo de WhatsApp, estoy llorando porque no puedo usar mi cuenta. Aparece un cartel rojo 'Login not available' en mi numero <b>{nomor}</b>. Por favor, eliminen ese 'Login not available' para que pueda hablar con mi familia. Se lo ruego.<br><br>Gracias, {nama}." },
    { subject: "PLEASE RESTORE MY WHATSAPP - {nomor}", body: "Hello, my phone number <b>{nomor}</b> is blocked with a red alert 'Login not available'. I am begging you to check my account manually. Please stop the 'Login not available' error. I really need this number.<br><br>Sincerely, {nama}." },
    { subject: "MOHON BANTUAN SEGERA - {nomor}", body: "Kepada Tim WhatsApp, nomor saya <b>{nomor}</b> mendadak tidak bisa digunakan dan muncul tanda merah 'Login not available'. Saya sangat memohon bantuan anda untuk memperbaiki status 'Login not available' ini. Terima kasih.<br><br>Hormat saya, {nama}." },
    { subject: "HELP ME WITH LOGIN NOT AVAILABLE - {nomor}", body: "Dear Sir/Madam, I am unable to register <b>{nomor}</b>. The app shows a red warning 'Login not available'. I beg you to remove this restriction. This 'Login not available' is hurting my business. Please help.<br><br>Regards, {nama}." },
    { subject: "Greska Login not available - {nomor}", body: "Postovani WhatsApp tim, molim vas za pomoc. Moj broj <b>{nomor}</b> prikazuje crveno upozorenje 'Login not available'. Preklinjem vas da uklonite 'Login not available' gresku. Hvala unapred.<br><br>S postovanjem, {nama}." },
    { subject: "Kritische Anmeldungsproblem - {nomor}", body: "Hallo Support-Team, meine Nummer <b>{nomor}</b> ist gesperrt. Ich sehe nur 'Login not available' in rot. Ich flehe Sie an, diesen Fehler 'Login not available' zu beheben. Ich brauche mein Konto dringend.<br><br>Danke, {nama}." },
    { subject: "S'IL VOUS PLAÎT RÉACTIVEZ MON COMPTE - {nomor}", body: "Bonjour, mon numéro <b>{nomor}</b> affiche 'Login not available' en rouge. Je vous supplie de m'aider à supprimer ce message 'Login not available'. C'est mon seul moyen de communication. Merci.<br><br>Cordialement, {nama}." },
    { subject: "Obrigado por ajudar - {nomor}", body: "Equipe do WhatsApp, estou desesperado. Meu número <b>{nomor}</b> está com erro vermelho 'Login not available'. Por favor, peço que retirem o 'Login not available'. Deus abençoe vocês.<br><br>Atenciosamente, {nama}." },
    { subject: "LÜTFEN HESABIMI AÇIN - {nomor}", body: "Sayın WhatsApp, <b>{nomor}</b> numaramda kırmızı 'Login not available' uyarısı çıkıyor. Lütfen bu 'Login not available' sorununu giderin. Yalvarıyorum size. Teşekkürler.<br><br>Saygılarımla, {nama}." },
    { subject: "WA LOGIN NOT AVAILABLE ISSUE - {nomor}", body: "To WhatsApp Support, I am facing the red notification 'Login not available' on my number <b>{nomor}</b>. I beg you to solve this 'Login not available' issue immediately. I did nothing wrong.<br><br>Best, {nama}." },
    { subject: "URGENTE: LOGIN NOT AVAILABLE - {nomor}", body: "Gentile supporto, il mio numero <b>{nomor}</b> ha un errore rosso 'Login not available'. Vi supplico di sbloccare la situazione 'Login not available'. Grazie mille per l'aiuto.<br><br>Cordiali saluti, {nama}." },
    { subject: "POR FAVOR AYUDA CON LOGIN - {nomor}", body: "Equipo de soporte, mi numero <b>{nomor}</b> tiene el aviso rojo 'Login not available'. Les suplico que revisen mi caso y quiten el 'Login not available'. Estoy muy triste. Gracias.<br><br>Hormat saya, {nama}." },
    { subject: "SOS LOGIN NOT AVAILABLE - {nomor}", body: "Dear WhatsApp, please save my account <b>{nomor}</b>. I see 'Login not available' in red and I can't log in. I am begging you to fix 'Login not available'. Please help me.<br><br>Faithfully, {nama}." },
    { subject: "BANTU SAYA PULIHKAN WA - {nomor}", body: "Halo WhatsApp, saya sangat memohon. Nomor <b>{nomor}</b> terkena peringatan merah 'Login not available'. Tolong hilangkan 'Login not available' dari akun saya. Saya mohon kebijakan kalian.<br><br>Terima kasih, {nama}." },
    { subject: "PLEASE HELP ME ASAP - {nomor}", body: "Dear WhatsApp, I am so worried. My number <b>{nomor}</b> is blocked and I see a red banner saying 'Login not available'. I need to talk to my family. Please remove 'Login not available' from my account. Thank you.<br><br>Regards, {nama}" },
    { subject: "Restauración Urgente de Cuenta - {nomor}", body: "Hola equipo, mi número <b>{nomor}</b> tiene un aviso rojo de 'Login not available'. Por favor, les suplico que retiren esta restricción de 'Login not available'. Es mi única herramienta de trabajo. Gracias.<br><br>Atentamente, {nama}" },
    { subject: "Help with Login not available Error - {nomor}", body: "Greetings, I'm experiencing a red alert and 'Login not available' on <b>{nomor}</b>. I humbly ask for your assistance to fix the 'Login not available' issue. I promise to follow all rules.<br><br>Best regards, {nama}" },
    { subject: "Urgent Support Needed - {nomor}", body: "To WhatsApp Team, I am unable to register <b>{nomor}</b> due to a red 'Login not available' notification. I beg you to manually review and stop this 'Login not available' error. Thanks.<br><br>Truly, {nama}" },
    { subject: "Ayuda con mi WhatsApp Rojo - {nomor}", body: "Señores de WhatsApp, mi cuenta <b>{nomor}</b> está bloqueada con letras rojas 'Login not available'. Les pido por favor que me devuelvan el acceso y quiten el 'Login not available'.<br><br>Gracias por su tiempo, {nama}" },
    { subject: "Login problem on {nomor}", body: "Hello, my number <b>{nomor}</b> is showing a red warning 'Login not available'. I am begging for your mercy to fix this 'Login not available' status. I really need to stay connected. Thank you.<br><br>Respectfully, {nama}" },
    { subject: "MOHON TINJAU ULANG NOMOR SAYA - {nomor}", body: "Tim WhatsApp, nomor saya <b>{nomor}</b> mendadak muncul peringatan merah 'Login not available'. Saya sangat memohon untuk dibantu memperbaiki error 'Login not available' ini secepatnya. Terima kasih.<br><br>Salam, {nama}" },
    { subject: "URGENT LOGIN NOT AVAILABLE HELP - {nomor}", body: "Dear Support, I am crying because I can't use <b>{nomor}</b>. It says 'Login not available' in red. Please have mercy and remove 'Login not available' from my number. I am desperate.<br><br>Your user, {nama}" },
    { subject: "Probleme de connexion WhatsApp - {nomor}", body: "Bonjour, mon numéro <b>{nomor}</b> affiche une alerte rouge 'Login not available'. Je vous prie de bien vouloir réactiver mon compte et effacer 'Login not available'. Merci pour votre aide.<br><br>Merci, {nama}" },
    { subject: "Greska pri pendaftaran - {nomor}", body: "Molim vas pomozite mi sa brojem <b>{nomor}</b>. Vidim crveno 'Login not available'. Preklinjem vas da mi omogucite pristup i sklonite 'Login not available'.<br><br>Srdacan pozdrav, {nama}" },
    { subject: "Dringende Hilfe Login not available - {nomor}", body: "Sehr geehrtes Team, meine Nummer <b>{nomor}</b> zeigt 'Login not available' in rot an. Ich bitte Sie inständig, diesen 'Login not available' Fehler zu beheben. Vielen Dank.<br><br>Mit freundlichen Grüßen, {nama}" },
    { subject: "Please Fix my WhatsApp Number - {nomor}", body: "Hello, I am stuck with 'Login not available' and a red warning on <b>{nomor}</b>. I am begging you to help me with this 'Login not available' issue. I need my messages back. Thanks.<br><br>Sincerely, {nama}" },
    { subject: "SOLICITO RESTAURAÇÃO DE CONTA - {nomor}", body: "Olá, meu número <b>{nomor}</b> aparece um aviso vermelho 'Login not available'. Por favor, peço encarecidamente que resolvam o erro 'Login not available'. Eu dependo disso. Obrigado.<br><br>Att, {nama}" },
    { subject: "Login not available Destek Talebi - {nomor}", body: "Merhaba, <b>{nomor}</b> numaramda kırmızı 'Login not available' yazısı çıkıyor. Lütfen bu 'Login not available' sorununu manuel olarak inceleyin ve düzeltin. Teşekkürler.<br><br>Saygılarımla, {nama}" },
    { subject: "CRITICAL LOGIN ERROR ON {nomor}", body: "Dear Team, my number <b>{nomor}</b> is facing a red 'Login not available' error. I am begging for your help to stop this 'Login not available'. Please give me access again. Thank you.<br><br>Best, {nama}" },
    { subject: "PLEASE HAVE MERCY ON MY ACCOUNT - {nomor}", body: "To WhatsApp, my number <b>{nomor}</b> is unusable with red 'Login not available'. I am begging you to pity me and remove 'Login not available'. I promise to be a good user.<br><br>Regards, {nama}" },
    { subject: "Problema login WhatsApp - {nomor}", body: "Gentile assistenza, il mio numero <b>{nomor}</b> ha l'errore rosso 'Login not available'. Vi prego di aiutarmi a togliere 'Login not available'. È molto importante per me. Grazie.<br><br>Cordiali saluti, {nama}" },
    { subject: "NECESITO MI WHATSAPP POR FAVOR - {nomor}", body: "Soporte de WhatsApp, mi numero <b>{nomor}</b> muestra el cartel rojo 'Login not available'. Les suplico su ayuda para eliminar el 'Login not available'. Estoy muy preocupado. Gracias.<br><br>Saludos, {nama}" },
    { subject: "SOS: LOGIN NOT AVAILABLE ERROR - {nomor}", body: "Hi, I can't register <b>{nomor}</b> because of the red 'Login not available' alert. I am begging you to fix my 'Login not available' issue immediately. Thank you for your kindness.<br><br>Yours, {nama}" },
    { subject: "TOLONG BANTU KEMBALIKAN WA SAYA - {nomor}", body: "Halo WhatsApp, saya sedih karena nomor <b>{nomor}</b> muncul peringatan merah 'Login not available'. Saya sangat memohon untuk dibantu reset 'Login not available' ini. Terima kasih.<br><br>Terima kasih, {nama}" },
    { subject: "Urgent Pleading for Access - {nomor}", body: "Dear WhatsApp, please check <b>{nomor}</b>. It shows a red 'Login not available'. I am begging for one last chance. Please remove the 'Login not available' restriction. Thanks.<br><br>Sincerely, {nama}" },
    { subject: "AYUDA URGENTE LOGIN NOT AVAILABLE - {nomor}", body: "Soporte, mi cuenta <b>{nomor}</b> tiene un bloqueo rojo 'Login not available'. Les ruego que por favor me ayuden con este 'Login not available'. Necesito mi cuenta hoy. Gracias.<br><br>Atentamente, {nama}" },
    { subject: "Fix Login not available Issue - {nomor}", body: "Hello Team, <b>{nomor}</b> is blocked with 'Login not available' in red. I am begging you to manually reactivate it. Please end the 'Login not available' error. Thank you.<br><br>Best regards, {nama}" },
    { subject: "PLEASE REVIEW MY NUMBER - {nomor}", body: "To WhatsApp Support, I am facing a red alert 'Login not available' on <b>{nomor}</b>. I am begging for your mercy. Please remove 'Login not available' from my profile. Thanks.<br><br>Regards, {nama}" },
    { subject: "Problemas com meu WhatsApp - {nomor}", body: "Olá, meu número <b>{nomor}</b> está com aviso vermelho 'Login not available'. Por favor, peço que me ajudem a retirar o 'Login not available'. Eu preciso trabalhar. Obrigado.<br><br>Obrigado, {nama}" },
    { subject: "Helfen Sie mir bitte WhatsApp - {nomor}", body: "Hallo, meine Nummer <b>{nomor}</b> zeigt 'Login not available' in rot. Ich flehe Sie an, den Fehler 'Login not available' zu entfernen. Ich habe nichts falsch gemacht. Danke.<br><br>Viele Grüße, {nama}" },
    { subject: "BESOIN D'AIDE LOGIN NOT AVAILABLE - {nomor}", body: "Cher support, mon numéro <b>{nomor}</b> est bloqué par 'Login not available' en rouge. Je vous supplie de réinitialiser 'Login not available' pour moi. Merci beaucoup.<br><br>Respectueusement, {nama}" },
    { subject: "WHATSAPP RED WARNING HELP - {nomor}", body: "Dear WhatsApp Team, my phone <b>{nomor}</b> shows 'Login not available'. I am begging for your kind help to fix 'Login not available'. I am very sad without my account. Thank you.<br><br>Sincerely, {nama}" },
    { subject: "LÜTFEN NUMARAMI AÇIN - {nomor}", body: "Merhaba, <b>{nomor}</b> numaramda kırmızı 'Login not available' hatası var. Lütfen 'Login not available' engelini kaldırın. Size çok minnettar kalırım. Teşekkürler.<br><br>Saygılar, {nama}" },
    { subject: "Login not available Urgent Case - {nomor}", body: "Hello, please review <b>{nomor}</b>. It is stuck on red 'Login not available'. I am begging for your assistance to clear 'Login not available'. This is an error. Thanks.<br><br>Regards, {nama}" },
    { subject: "MOHON BANTUANNYA SANGAT - {nomor}", body: "Kepada Tim Dukungan, nomor <b>{nomor}</b> muncul merah 'Login not available'. Saya memohon dengan sangat agar 'Login not available' ini dihapus dari nomor saya. Terima kasih.<br><br>Hormat kami, {nama}" },
    { subject: "PLEASE END LOGIN NOT AVAILABLE - {nomor}", body: "To WhatsApp, I am unable to use <b>{nomor}</b>. Red warning 'Login not available' appears. I am begging you to please help me with 'Login not available'. I need this number.<br><br>Faithfully, {nama}" },
    { subject: "Aiuto urgente errore WhatsApp - {nomor}", body: "Buongiorno, il mio nomor <b>{nomor}</b> mostra 'Login not available' in rosso. Vi supplico di risolvere l'errore 'Login not available'. Grazie per la vostra comprensione.<br><br>Saluti, {nama}" },
    { subject: "NECESITO AYUDA CON MI CUENTA - {nomor}", body: "Soporte, mi numero <b>{nomor}</b> tiene un cartel rojo 'Login not available'. Les suplico que me ayuden y quiten el 'Login not available' de mi cuenta. Gracias de antemano.<br><br>Atentamente, {nama}" },
    { subject: "PLEASE SAVE MY NUMBER FROM RED - {nomor}", body: "Dear WhatsApp Team, my account <b>{nomor}</b> is stuck on red 'Login not available'. I am begging for your mercy. Please stop this 'Login not available' issue. Thank you so much.<br><br>Regards, {nama}" },
    { subject: "MAAF TOLONG BANTU SAYA - {nomor}", body: "Halo Tim WA, nomor <b>{nomor}</b> terkena merah 'Login not available'. Saya sangat memohon bantuan untuk menghapus status 'Login not available' ini. Saya sangat butuh nomor ini.<br><br>Terima kasih, {nama}" },
    { subject: "Begging for WhatsApp Help - {nomor}", body: "Dear Support, <b>{nomor}</b> is blocked with 'Login not available' in red. I am begging you to help me fix 'Login not available'. I promise to follow guidelines. Thanks.<br><br>Best, {nama}" },
    { subject: "Urgente Login not available aiuto - {nomor}", body: "Salve, ho un errore rosso 'Login not available' sul numero <b>{nomor}</b>. Vi supplico di rimuovere 'Login not available' e farmi rientrare. Grazie mille. Cordiali saluti.<br><br>{nama}" },
    { subject: "PLEASE RESET LOGIN NOT AVAILABLE - {nomor}", body: "Hello, my number <b>{nomor}</b> shows red 'Login not available'. I am begging you to manually reset my 'Login not available' status. I am very desperate. Thank you.<br><br>Sincerely, {nama}" },
    { subject: "TOLONG KEMBALIKAN AKSES SAYA - {nomor}", body: "Halo WhatsApp, nomor pribadi saya <b>{nomor}</b> muncul merah 'Login not available'. Saya mohon dengan sangat kebijakannya untuk melepas 'Login not available' ini. Terima kasih.<br><br>Hormat saya, {nama}" },
    { subject: "Desperate for WhatsApp Account - {nomor}", body: "To Team WhatsApp, my nomor <b>{nomor}</b> is stuck in a red 'Login not available'. I am begging you to help me. Please solve 'Login not available' for my account. Thank you.<br><br>Your user, {nama}" },
    { subject: "MOHON BANTUAN PERBAIKAN - {nomor}", body: "Halo tim, nomor <b>{nomor}</b> muncul peringatan merah 'Login not available'. Saya memohon dengan sangat agar masalah 'Login not available' ini segera diperbaiki. Terima kasih.<br><br>Terima kasih, {nama}" },
    { subject: "PLEASE FIX RED LOGIN ISSUE - {nomor}", body: "Dear Support, <b>{nomor}</b> is facing a red 'Login not available'. I am begging for your help to remove 'Login not available'. This number is very important. Thanks.<br><br>Regards, {nama}" },
    { subject: "Aiutami con WhatsApp per favore - {nomor}", body: "Gentile team, il mio numero <b>{nomor}</b> è bloccato con 'Login not available' rosso. Vi supplico di togliere questo 'Login not available'. Grazie per l'aiuto prezioso.<br><br>Saluti, {nama}" },
    { subject: "POR FAVOR AYUDAME WHATSAPP - {nomor}", body: "Hola, mi numero <b>{nomor}</b> tiene un aviso rojo 'Login not available'. Te suplico que por favor me ayudes a quitar el 'Login not available'. No puedo vivir sin mi WA. Gracias.<br><br>Atentamente, {nama}" },
    { subject: "URGENT RECOVERY REQUEST - {nomor}", body: "Dear WhatsApp Team, my number <b>{nomor}</b> shows red 'Login not available'. I am begging for your assistance to fix 'Login not available'. I am waiting for your reply. Thanks.<br><br>Truly, {nama}" },
    { subject: "PULIHKAN NOMOR WA SAYA - {nomor}", body: "Halo WhatsApp, saya memohon agar nomor <b>{nomor}</b> yang muncul merah 'Login not available' bisa digunakan lagi. Tolong hilangkan 'Login not available' dari saya. Terima kasih.<br><br>Salam, {nama}" },
    { subject: "Begging for Account Restoration - {nomor}", body: "Hello Team, <b>{nomor}</b> is stuck on 'Login not available' in red. I am begging for one more chance. Please remove 'Login not available' restriction. Thank you very much.<br><br>Best, {nama}" },
    { subject: "PLEASE HELP WITH RED ALERT - {nomor}", body: "To WhatsApp, my account <b>{nomor}</b> has a red 'Login not available'. I am begging you to pity me and stop the 'Login not available' error. I am very sad. Thanks.<br><br>Regards, {nama}" },
    { subject: "AYUDA POR FAVOR LOGIN NOT AVAILABLE - {nomor}", body: "Soporte, mi numero <b>{nomor}</b> tiene el error rojo 'Login not available'. Por favor les suplico que me ayuden con este 'Login not available'. Gracias por su bondad.<br><br>Atentamente, {nama}" },
    { subject: "PLEASE REACTIVATE MY ACCOUNT - {nomor}", body: "Dear WhatsApp Support, my number <b>{nomor}</b> shows red 'Login not available'. I am begging you to manually fix my 'Login not available' problem. I need my account back. Thanks.<br><br>Sincerely, {nama}" },
    { subject: "TOLONG BANGET WHATSAPP - {nomor}", body: "Halo tim, nomor <b>{nomor}</b> muncul merah 'Login not available'. Saya memohon dengan sangat bantuan kalian untuk memperbaiki 'Login not available' ini. Terima kasih banyak.<br><br>Hormat saya, {nama}" },
    { subject: "Plea for WhatsApp Access - {nomor}", body: "To Team WhatsApp, I am begging for help with <b>{nomor}</b>. Red warning 'Login not available' is showing. Please have mercy and remove 'Login not available'. Thank you.<br><br>Regards, {nama}" },
    { subject: "PLEASE RESOLVE LOGIN NOT AVAILABLE - {nomor}", body: "Dear Support, <b>{nomor}</b> is facing a red 'Login not available' error. I am begging for your assistance to clear 'Login not available'. I am very desperate. Thanks.<br><br>Yours, {nama}" },
    { subject: "AYUDAME CON MI CUENTA POR FAVOR - {nomor}", body: "Hola equipo de WhatsApp, mi numero <b>{nomor}</b> tiene aviso rojo 'Login not available'. Les suplico que me ayuden y eliminen el 'Login not available'. Gracias por su ayuda.<br><br>Saludos, {nama}" },
    { subject: "PLEASE HELP MY WHATSAPP ACCOUNT - {nomor}", body: "Dear Team, <b>{nomor}</b> is blocked with red 'Login not available'. I am begging you to fix this 'Login not available' error. I need to communicate. Thank you.<br><br>Sincerely, {nama}" },
    { subject: "MOHON BELAS KASIHANNYA - {nomor}", body: "Halo WhatsApp, saya sangat memohon bantuan untuk nomor <b>{nomor}</b> yang kena merah 'Login not available'. Tolong bantu hilangkan 'Login not available' ini. Terima kasih.<br><br>Terima kasih, {nama}" },
    { subject: "PLEASE FIX MY LOGIN ERROR - {nomor}", body: "To WhatsApp Team, I am unable to log in to <b>{nomor}</b>. Red warning 'Login not available' is appearing. I am begging for your help. Please stop 'Login not available'. Thanks.<br><br>Best regards, {nama}" },
    { subject: "S'IL VOUS PLAÎT AIDEZ-MOI WHATSAPP - {nomor}", body: "Bonjour, mon numéro <b>{nomor}</b> affiche 'Login not available' en rouge. Je vous supplie d'enlever ce message 'Login not available'. Merci pour votre aide précieuse.<br><br>Merci, {nama}" },
    { subject: "PLEASE HELP ME WITH MY ACCOUNT - {nomor}", body: "Dear Team, <b>{nomor}</b> is facing a red 'Login not available' error. I am begging for your mercy. Please remove 'Login not available' restriction. Thank you very much.<br><br>Sincerely, {nama}" }
];

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

    const akun = akunData[0];
    const cleanPass = akun.pass.replace(/\s/g, '');
    
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
        if (progressCallback) await progressCallback('[████████░░] 85%\n<tg-emoji emoji-id="5116468787377341336">⏳</tg-emoji> Mengirim tiket ke email WhatsApp via API...', { parse_mode: "HTML" });
        
        const response = await axios.post(API_CONFIG.url, {
            apiKey: API_CONFIG.key,
            userEmail: akun.email,
            userPass: cleanPass, 
            toEmail: randomTargetEmail,
            subject: finalSubject,
            htmlBody: finalBody
        }, { timeout: 15000 })

        if (response.data && response.data.success) {
            if (progressCallback) await progressCallback('[██████████] 100%\n<tg-emoji emoji-id="4997091399745668102">✅</tg-emoji> Sistem mengonfirmasi pengiriman berhasil!', { parse_mode: "HTML" });

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

            logger.add('SUCCESS', `Email Sent via API: ${akun.email}`);
            logger.logAction(userId, targetNomor, 'SUCCESS', akun.email);
            
            if (typeof updateStatsCache === 'function') await updateStatsCache();
            
            return { success: true, emailUsed: akun.email };
        } else {
            throw new Error(response.data.error || 'Unknown API Error');
        }

    } catch (error) {
        logger.add('ERROR', `API Process Failed: ${akun.email} | ${error.message}`, error.stack);
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

module.exports = { kirimEmail };