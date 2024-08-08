const express = require('express');
const router = express.Router();
const Cotizacion = require('../models/cotizacion');
const Producto = require('../models/producto');
const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

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


// Ruta para verificar una cotización
router.post('/vercotizaciones/verificar/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const cotizacion = await Cotizacion.findById(id);
        if (!cotizacion) {
            return res.status(404).send('Cotización no encontrada');
        }
        cotizacion.estado = 'Verificada';
        await cotizacion.save();
        res.redirect('/vercotizaciones');
    } catch (error) {
        console.error('Error al verificar cotización:', error);
        res.status(500).send('Error interno al verificar cotización');
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

        const doc = new PDFDocument();
        let filename = `cotizacion_${id}.pdf`;
        filename = encodeURI(filename);

        res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-type', 'application/pdf');

        doc.fontSize(16).text(`Cotización ID: ${cotizacion._id}`, { underline: true });
        doc.fontSize(14).text(`Usuario: ${cotizacion.usuarioNombre}`);
        doc.text(`Dirección: ${cotizacion.usuario.direccion}`);
        doc.text(`Correo: ${cotizacion.usuario.correo}`);
        doc.text(`Teléfono: ${cotizacion.usuario.number}`);

        doc.fontSize(12).text('Productos:');
        let y = 100;
        let total = 0;

        cotizacion.productos.forEach((producto, index) => {
            const subtotal = producto.precio ? producto.precio * producto.cantidad : 0;
            total += subtotal;
            doc.text(`${index + 1}. ${producto.nombre} - Cantidad: ${producto.cantidad} - Precio Unitario: ${producto.precio || 'N/A'} - Subtotal: ${subtotal.toFixed(2)}`, {
                align: 'left',
                y
            });
            y += 20;
        });

        doc.text(`Total: ${total.toFixed(2)}`, { align: 'left', y: y + 10 });

        doc.pipe(res);
        doc.end();
    } catch (error) {
        console.error('Error al generar el PDF:', error);
        res.status(500).send('Error interno al generar el PDF');
    }
});

module.exports = router;
