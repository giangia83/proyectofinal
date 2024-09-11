const express = require('express');
const router = express.Router();
const Cotizacion = require('../models/cotizacion');
const Producto = require('../models/producto');
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');
const transporter = require('../controllers/nodemailer'); // Configuración de Nodemailer

// Ruta para obtener todas las cotizaciones
router.get('/vercotizaciones', async (req, res) => {
    try {
        const productos = await Producto.find();
        const cotizaciones = await Cotizacion.find().populate('usuario'); // Llenar el campo de usuario con los detalles del usuario

        res.render('cotizaciones/index', {
            productos,
            cotizaciones
        });
    } catch (error) {
        console.error('Error al obtener cotizaciones:', error);
        res.status(500).send('Error interno al obtener cotizaciones');
    }
});

// Ruta para obtener detalles de una cotización específica
router.get('/vercotizaciones/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const cotizacion = await Cotizacion.findById(id).populate('productos'); // Asegúrate de que 'productos' esté poblado si es necesario
        if (!cotizacion) {
            return res.status(404).json({ message: 'Cotización no encontrada' });
        }
        res.json(cotizacion);
    } catch (error) {
        console.error('Error al obtener cotización:', error);
        res.status(500).json({ message: 'Error interno al obtener cotización' });
    }
});

// Ruta para eliminar una cotización
router.post('/vercotizaciones/eliminar/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const cotizacion = await Cotizacion.findById(id);
        if (!cotizacion) {
            return res.status(404).json({ message: 'Cotización no encontrada' });
        }

        await Cotizacion.findByIdAndDelete(id);
        res.redirect('/tuspedidos'); // Redirige a la lista de cotizaciones después de eliminar
    } catch (error) {
        console.error('Error al eliminar la cotización:', error);
        res.status(500).json({ message: 'Error interno al eliminar la cotización' });
    }
});


// Ruta para obtener una cotización específica por ID
router.get('/vercotizaciones/detalles/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const cotizacion = await Cotizacion.findById(id).populate('productos');
        if (!cotizacion) {
            return res.status(404).send('Cotización no encontrada');
        }
        res.json(cotizacion);
    } catch (error) {
        console.error('Error al obtener detalles de la cotización:', error);
        res.status(500).send('Error interno al obtener detalles de la cotización');
    }
});

// Ruta para actualizar los precios de los productos en una cotización
router.post('/vercotizaciones/actualizar/:id', async (req, res) => {
    const { id } = req.params;
    const { precios } = req.body; // Array de objetos con productoId y precio

    try {
        const cotizacion = await Cotizacion.findById(id);
        if (!cotizacion) {
            return res.status(404).json({ message: 'Cotización no encontrada' });
        }

        // Actualizar los precios de los productos en la cotización
        precios.forEach(({ productoId, precio }) => {
            const producto = cotizacion.productos.find(p => p.id === productoId);
            if (producto) {
                producto.precio = precio; // Actualizar el precio del producto
            }
        });

        await cotizacion.save();
        res.json({ message: 'Cotización actualizada correctamente', cotizacion });
    } catch (error) {
        console.error('Error al actualizar la cotización:', error);
        res.status(500).json({ message: 'Error interno al actualizar la cotización' });
    }
});

// Ruta para generar un PDF de la cotización
router.get('/vercotizaciones/pdf/:id', async (req, res) => {
    const { id } = req.params;

    try {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send('ID de cotización inválido');
        }

        const cotizacion = await Cotizacion.findById(id).populate('usuario');
        if (!cotizacion) {
            return res.status(404).send('Cotización no encontrada');
        }

        const doc = new PDFDocument({ margin: 50 });
        let filename = `cotizacion_${id}.pdf`;
        filename = encodeURI(filename);

        res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-type', 'application/pdf');

        // Generar el contenido del PDF
        doc.fontSize(20).text('Starclean C.A', { align: 'center', underline: true });
        doc.fontSize(14).text('Cotización', { align: 'center', margin: [0, 10] });
        doc.moveDown();

        doc.fontSize(12).text(`Cliente: ${cotizacion.usuario.nombre}`, { align: 'left' });
        doc.text(`Dirección: ${cotizacion.usuario.direccion}`);
        doc.text(`Correo: ${cotizacion.usuario.correo}`);
        doc.text(`Teléfono: ${cotizacion.usuario.number}`);
        doc.moveDown();

        doc.fontSize(12).text('Productos:', { underline: true });
        doc.moveDown();

        doc.fontSize(10).text('Descripción          | Cantidad | Precio Unitario | Subtotal', { align: 'left' });

        let total = 0;
        cotizacion.productos.forEach((producto) => {
            const subtotal = producto.precio ? producto.precio * producto.cantidad : 0;
            total += subtotal;
            doc.text(
                `${producto.nombre.padEnd(20)} | ${producto.cantidad.toString().padEnd(7)} | ${producto.precio ? producto.precio.toFixed(2) : 'N/A'.padEnd(15)} | ${subtotal.toFixed(2)}`,
                { align: 'left' }
            );
        });

        doc.text('--------------------------------------------------------------', { align: 'left' });
        doc.text(`Total: ${total.toFixed(2)}`, { align: 'right', margin: [0, 10] });

        // Finalizar el documento
        doc.pipe(res);
        doc.end();
    } catch (error) {
        console.error('Error al generar el PDF:', error);
        res.status(500).send('Error interno al generar el PDF');
    }
});

// Ruta para verificar y enviar la cotización por correo
router.post('/vercotizaciones/verificar/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Verificar la cotización
        const cotizacion = await Cotizacion.findById(id).populate('usuario');
        if (!cotizacion) {
            return res.status(404).json({ message: 'Cotización no encontrada' });
        }

        // Crear el PDF de la cotización
        const doc = new PDFDocument({ margin: 50 });

        // Generar el contenido del PDF en un buffer
        const chunks = [];
        doc.on('data', chunks.push.bind(chunks));
        doc.on('end', () => {
            const pdfBuffer = Buffer.concat(chunks);

            // Enviar el correo electrónico con el PDF como adjunto
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: cotizacion.usuario.correo,
                subject: 'Cotización Verificada - Starclean C.A',
                html: `
                    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
                        <header style="text-align: center; padding-bottom: 20px;">
                            <h1 style="color: #E53935;">Cotización Verificada</h1>
                            <p style="font-size: 16px; color: #555;">Hola ${cotizacion.usuario.nombre},</p>
                        </header>
                        
                        <section>
                            <p style="font-size: 16px; color: #555;">Adjunto encontrarás la cotización verificada. Aquí están los detalles:</p>
                            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                                <thead>
                                    <tr style="background-color: #E53935; color: #fff;">
                                        <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Descripción</th>
                                        <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Cantidad</th>
                                        <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Precio Unitario</th>
                                        <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${cotizacion.productos.map(producto => `
                                        <tr>
                                            <td style="border: 1px solid #ddd; padding: 12px;">${producto.nombre}</td>
                                            <td style="border: 1px solid #ddd; padding: 12px;">${producto.cantidad}</td>
                                            <td style="border: 1px solid #ddd; padding: 12px;">${producto.precio ? producto.precio.toFixed(2) : 'N/A'}</td>
                                            <td style="border: 1px solid #ddd; padding: 12px;">${producto.precio ? (producto.precio * producto.cantidad).toFixed(2) : 'N/A'}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                            
                            <p style="font-size: 16px; color: #555;">El total de la cotización es: <strong style="color: #E53935;">${cotizacion.productos.reduce((total, producto) => total + (producto.precio ? producto.precio * producto.cantidad : 0), 0).toFixed(2)}</strong></p>
                        </section>

                        <footer style="text-align: center; padding-top: 20px; border-top: 1px solid #ddd;">
                            <p style="font-size: 16px; color: #555;">Si tienes alguna pregunta, no dudes en contactarnos.</p>
                            <p style="font-size: 14px; color: #999;">Saludos cordiales,<br>Starclean C.A - Miranda, Guatire</p>
                        </footer>
                    </div>
                `,
                attachments: [
                    {
                        filename: `cotizacion_${id}.pdf`,
                        content: pdfBuffer
                    }
                ]
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error al enviar el correo:', error);
                    return res.status(500).json({ message: 'Error al enviar el correo' });
                }

                res.json({ message: 'Cotización verificada y enviada por correo' });
            });
        });

        // Generar el contenido del PDF
        doc.fontSize(20).text('Starclean C.A', { align: 'center', underline: true });
        doc.fontSize(14).text('Cotización', { align: 'center', margin: [0, 10] });
        doc.moveDown();

        doc.fontSize(12).text(`Cliente: ${cotizacion.usuario.nombre}`, { align: 'left' });
        doc.text(`Dirección: ${cotizacion.usuario.direccion}`);
        doc.text(`Correo: ${cotizacion.usuario.correo}`);
        doc.text(`Teléfono: ${cotizacion.usuario.telefono}`);
        doc.moveDown();

        doc.fontSize(12).text('Productos:', { underline: true });
        doc.moveDown();

        doc.fontSize(10).text('Descripción          | Cantidad | Precio Unitario | Subtotal', { align: 'left' });

        let total = 0;
        cotizacion.productos.forEach((producto) => {
            const subtotal = producto.precio ? producto.precio * producto.cantidad : 0;
            total += subtotal;
            doc.text(
                `${producto.nombre.padEnd(20)} | ${producto.cantidad.toString().padEnd(7)} | ${producto.precio ? producto.precio.toFixed(2) : 'N/A'.padEnd(15)} | ${subtotal.toFixed(2)}`,
                { align: 'left' }
            );
        });

        doc.text('--------------------------------------------------------------', { align: 'left' });
        doc.text(`Total: ${total.toFixed(2)}`, { align: 'right', margin: [0, 10] });

        doc.end();
    } catch (error) {
        console.error('Error al verificar y enviar la cotización:', error);
        res.status(500).json({ message: 'Error interno al verificar y enviar la cotización' });
    }
});

module.exports = router;
