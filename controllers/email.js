const transporter = require('../controllers/nodemailer');
const Usuario = require('../models/usuario');

async function enviarCorreoCotizacion(detallesCotizacion) {
    try {
        // Obtener el usuario basado en el correo proporcionado en detallesCotizacion
        const usuario = await Usuario.findById(detallesCotizacion.usuarioId); 

        // Verificar si el usuario fue encontrado
        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }

        const mailOptions = {
            from: process.env.EMAIL_USER, 
            to: usuario.correo, // Correo del destinatario
            subject: 'Detalles de tu Cotización',
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
                    <header style="text-align: center; padding-bottom: 20px;">
                        <h1 style="color: #E53935;">Gracias por tu Cotización</h1>
                        <p style="font-size: 16px; color: #555;">Hola ${usuario.nombre},</p>
                    </header>
                    
                    <section>
                        <p style="font-size: 16px; color: #555;">Tu cotización ha sido recibida y está en proceso. Aquí están los detalles:</p>
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                            <thead>
                                <tr style="background-color: #E53935; color: #fff;">
                                    <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Producto</th>
                                    <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Categoría</th>
                                    <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Cantidad</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${detallesCotizacion.productos.map(producto => `
                                    <tr>
                                        <td style="border: 1px solid #ddd; padding: 12px;">${producto.nombre}</td>
                                        <td style="border: 1px solid #ddd; padding: 12px;">${producto.categoria}</td>
                                        <td style="border: 1px solid #ddd; padding: 12px;">${producto.cantidad}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                        
                        <p style="font-size: 16px; color: #555;">Gracias por tu confianza.</p>
                    </section>

                    <footer style="text-align: center; padding-top: 20px; border-top: 1px solid #ddd;">
                        <p style="font-size: 16px; color: #555;">Para ver el estado de tus pedidos, haz clic en el siguiente enlace:</p>
                        <a href="https://starclean.onrender.com/tuspedidos/" style="display: inline-block; padding: 10px 20px; margin-top: 10px; color: #fff; background-color: #E53935; text-decoration: none; border-radius: 4px;">Ver Mis Pedidos</a>
                        <p style="font-size: 14px; color: #999;">Saludos cordiales,<br>Starclean C.A - Miranda, Guatire</p>
                    </footer>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Correo enviado exitosamente');
    } catch (error) {
        console.error('Error al enviar correo:', error);
        throw new Error('Error al enviar correo');
    }
}

module.exports = enviarCorreoCotizacion;
