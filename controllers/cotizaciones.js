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
                text: `Estimado/a ${cotizacion.usuario.nombre},\n\nAdjunto encontrará la cotización verificada.\n\nSaludos cordiales,\nStarclean C.A`,
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

        doc.end();
    } catch (error) {
        console.error('Error al verificar y enviar la cotización:', error);
        res.status(500).json({ message: 'Error interno al verificar y enviar la cotización' });
    }
});



        // Enviar el correo electrónico
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: cotizacion.usuario.correo,
            subject: 'Cotización Verificada - Starclean C.A',
            text: `Estimado/a ${cotizacion.usuario.nombre},\n\nAdjunto encontrará la cotización verificada.\n\nSaludos cordiales,\nStarclean C.A`,
            attachments: [
                {
                    filename: filename,
                    path: pdfPath
                }
            ]
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error al enviar el correo:', error);
                return res.status(500).json({ message: 'Error al enviar el correo' });
            }

            // Eliminar el archivo PDF después de enviarlo
            fs.unlink(pdfPath, (err) => {
                if (err) console.error('Error al eliminar el archivo:', err);
            });

            res.json({ message: 'Cotización verificada y enviada por correo' });
        });

   
module.exports = router;
