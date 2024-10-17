const express = require('express');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const { Usuario } = require('../models'); 
const router = express.Router();


const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
};


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'supermercadosuperalimento@gmail.com', 
      pass: 'ejzzqaisipfojrzr', 
    },
});


router.post('/recuperar-password', async (req, res) => {
    const { correo_usuario } = req.body;

    try {

        const usuario = await Usuario.findOne({ where: { correo_usuario } });

        if (!usuario) {
            return res.status(404).json({ message: 'Correo no registrado' });
        }


        const newPassword = generatePassword();


        const hashedPassword = await bcrypt.hash(newPassword, 10);

        usuario.clave = hashedPassword;
        await usuario.save();

        const mailOptions = {
            from: 'supermercadosuperalimento@gmail.com',
            to: usuario.correo_usuario,
            subject: 'Restablecimiento de contraseña',
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2 style="color: #2ec146;">Supermercado SuperAlimento</h2>
                    <p>Hola <strong>${usuario.nombre_usuario}</strong>,</p>
                    <p>Hemos recibido tu solicitud para restablecer la contraseña.</p>
                    <p>A continuación, encontrarás tu nueva contraseña:</p>
                    <div style="padding: 10px; border: 1px solid #ddd; background-color: #f9f9f9; width: fit-content; margin: 0 auto;">
                        <p><strong>Número de Documento:</strong> ${usuario.numero_documento}</p>
                        <p><strong>Nueva Contraseña:</strong> <span style="color: #2ec146;">${newPassword}</span></p>
                    </div>
                    <p>Te recomendamos cambiar esta contraseña tan pronto como inicies sesión en nuestro sistema.</p>
                    <p>Recuerda que lo puedes hacer dando en opciones y perfil.</p>
                    <p>Si no solicitaste este cambio, por favor contacta con nuestro equipo de soporte.</p>
                    <br>
                    <p>Saludos cordiales,</p>
                    <p><strong>Supermercado SuperAlimento</strong></p>
                </div>
            `,
        };


        await transporter.sendMail(mailOptions);
        res.json({ message: 'Se ha enviado una nueva contraseña a tu correo' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router;
