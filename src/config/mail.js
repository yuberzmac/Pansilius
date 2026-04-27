const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: process.env.MAIL_PORT || 465,
    secure: true, // true para puerto 465, false para otros
    auth: {
        user: process.env.MAIL_USER, // Tu correo empresarial
        pass: process.env.MAIL_PASS  // Tu contraseña de aplicación
    }
});

const sendResetEmail = async (email, token) => {
    const resetUrl = `https://git.minecraft17.online/reset-password.html?token=${token}`;
    
    const mailOptions = {
        from: `"Pansilius Pro Support" <${process.env.MAIL_USER}>`,
        to: email,
        subject: '🔐 Recuperación de Contraseña - Pansilius Pro',
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #6366f1;">Pansilius Pro</h2>
                <p>Hola,</p>
                <p>Has solicitado restablecer tu contraseña. Haz clic en el botón de abajo para continuar:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Restablecer Contraseña</a>
                </div>
                <p style="font-size: 0.8rem; color: #666;">Este enlace expirará en 1 hora. Si no solicitaste esto, puedes ignorar este correo.</p>
                <hr style="border: 0; border-top: 1px solid #eee;">
                <p style="font-size: 0.7rem; color: #999;">© 2026 Pansilius Corp. Sistema de Seguridad Avanzado.</p>
            </div>
        `
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { sendResetEmail };
