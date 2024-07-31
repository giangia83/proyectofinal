require('dotenv').config(); // Carga las variables de entorno desde el archivo .env
const nodemailer = require('nodemailer');

// Configura el transporter usando las variables de entorno
const transporter = nodemailer.createTransport({
    service: 'gmail', // o el servicio SMTP que prefieras
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

module.exports = transporter;