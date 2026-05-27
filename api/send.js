import nodemailer from "nodemailer"

export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            error: "Method not allowed"
        })
    }

    try {

        const {
            apiKey,
            userEmail,
            userPass,
            toEmail,
            subject,
            htmlBody
        } = req.body

        // VALIDASI API KEY
        if (apiKey !== "AIDGANS") {
            return res.status(403).json({
                success: false,
                error: "Invalid API Key"
            })
        }

        // VALIDASI DATA
        if (
            !userEmail ||
            !userPass ||
            !toEmail ||
            !subject ||
            !htmlBody
        ) {
            return res.status(400).json({
                success: false,
                error: "Data tidak lengkap"
            })
        }

        // SMTP
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: userEmail,
                pass: userPass
            }
        })

        // SEND EMAIL
        const info = await transporter.sendMail({
            from: `"WhatsApp Support" <${userEmail}>`,
            to: toEmail,
            subject: subject,
            html: htmlBody
        })

        return res.status(200).json({
            success: true,
            message: "Email berhasil dikirim",
            messageId: info.messageId
        })

    } catch (err) {

        console.log(err)

        return res.status(500).json({
            success: false,
            error: err.message
        })
    }
}
