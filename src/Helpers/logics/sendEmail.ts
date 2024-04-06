import nodemailer from "nodemailer";

export async function sendEmail({
    to,
    subject = "",
    text = "",
    html = "",
}: {
    to: string;
    subject: string;
    text: string;
    html: string;
}) {
    console.log("Sending email...");
    /**
     * Google SMTP server
     */
    const googleTransporter = {
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_SPECIFIC_PASSWORD,
        },
    };

    /**
     * iCloud SMTP server
     */
    const icloudTransported = {
        service: "smtp.mail.me.com",
        port: 587,
        auth: {
            user: process.env.EMAIL_USER_ICLOUD,
            pass: process.env.EMAIL_SPECIFIC_PASSWORD_ICLOUD,
        },
    };

    // Create a transporter object
    const transporter = nodemailer.createTransport(googleTransporter);

    // Define the email options
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        text: text ?? "",
        html: html ?? "",
    };

    try {
        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.messageId);
    } catch (error: any) {
        console.error("Error sending email:", error);
    }
}
