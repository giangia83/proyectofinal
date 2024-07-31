// services/emailService.js
const transporter = require('../controllers/nodemailer');

async function enviarCorreoCotizacion(correo, detallesCotizacion) {
    const mailOptions = {
        from: process.env.EMAIL_USER, // Usa la variable de entorno para el correo del remitente
        to: correo, // Correo del destinatario
        subject: 'Detalles de tu Cotización',
        html: `
            <h1>Gracias por tu cotización</h1>
            <p>Hola,</p>
            <p>Tu cotización ha sido recibida y está en proceso. Aquí están los detalles:</p>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr>
                        <th style="border: 1px solid #dddddd; padding: 8px; text-align: left;">Producto</th>
                        <th style="border: 1px solid #dddddd; padding: 8px; text-align: left;">Categoría</th>
                        <th style="border: 1px solid #dddddd; padding: 8px; text-align: left;">Cantidad</th>
                    </tr>
                </thead>
                <tbody>
                    ${detallesCotizacion.productos.map(producto => `
                        <tr>
                            <td style="border: 1px solid #dddddd; padding: 8px;">${producto.nombre}</td>
                            <td style="border: 1px solid #dddddd; padding: 8px;">${producto.categoria}</td>
                            <td style="border: 1px solid #dddddd; padding: 8px;">${producto.cantidad}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <p>Estado: ${detallesCotizacion.estado}</p>
            <p>Gracias por tu confianza.</p>
            <p>Saludos cordiales,<br>Tu Empresa</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Correo enviado exitosamente');
    } catch (error) {
        console.error('Error al enviar correo:', error);
        throw new Error('Error al enviar correo');
    }
}

module.exports = enviarCorreoCotizacion;
