require('dotenv').config();
const nodemailer = require('nodemailer');
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('Las variables de entorno EMAIL_USER y EMAIL_PASS no están definidas.');
    process.exit(1);
}
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
transporter.verify((error, success) => {
    if (error) {
        console.error('Error al conectar con el servidor SMTP:', error);
    } else {
        console.log('Conexión con el servidor SMTP exitosa');
    }
});

module.exports = transporter;
/* Este es el codigo que establece los correos */
