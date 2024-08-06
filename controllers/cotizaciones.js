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

// Ruta para eliminar una cotización
router.post('/vercotizaciones/eliminar/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Cotizacion.findByIdAndDelete(id);
        res.redirect('/vercotizaciones');
    } catch (error) {
        console.error('Error al eliminar cotización:', error);
        res.status(500).send('Error interno al eliminar cotización');
    }
});

// Ruta para actualizar los precios de una cotización
router.post('/vercotizaciones/actualizar/:id', async (req, res) => {
    const { id } = req.params;
    const { precios } = req.body;

    try {
        const cotizacion = await Cotizacion.findById(id);
        if (!cotizacion) {
            return res.status(404).send('Cotización no encontrada');
        }

        // Actualizar los precios de los productos
        cotizacion.productos.forEach(producto => {
            const precio = precios.find(p => p.productoId === producto._id.toString());
            if (precio) {
                producto.precio = precio.precio;
            }
        });

        cotizacion.estado = 'Verificada'; // Cambia el estado si es necesario
        await cotizacion.save();

        res.json(cotizacion);
    } catch (error) {
        console.error('Error al actualizar cotización:', error);
        res.status(500).send('Error interno al actualizar cotización');
    }
});

// Ruta para generar un PDF de la cotización
router.get('/vercotizaciones/pdf/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Asegúrate de que el ID sea una cadena de 24 caracteres
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send('ID de cotización inválido');
        }

        const cotizacion = await Cotizacion.findById(id).populate('usuario').populate('productos');
        if (!cotizacion) {
            return res.status(404).send('Cotización no encontrada');
        }

        // Crear un nuevo documento PDF
        const doc = new PDFDocument();
        let filename = `cotizacion_${id}.pdf`;
        filename = encodeURI(filename);

        // Enviar el PDF como respuesta
        res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-type', 'application/pdf');

        // Crear el contenido del PDF
        doc.fontSize(16).text(`Cotización ID: ${cotizacion._id}`, { underline: true });
        doc.fontSize(14).text(`Usuario: ${cotizacion.usuario ? cotizacion.usuario.nombre : 'N/A'}`);
        doc.text(`Dirección: ${cotizacion.usuario ? cotizacion.usuario.direccion : 'N/A'}`);

        doc.fontSize(12).text('Productos:');
        let y = 100;
        cotizacion.productos.forEach((producto, index) => {
            doc.text(`${index + 1}. ${producto.nombre ? producto.nombre : 'N/A'} - Cantidad: ${producto.cantidad ? producto.cantidad : 'N/A'} - Precio Unitario: ${producto.precio ? producto.precio : 'N/A'}`, {
                continued: true,
                align: 'left',
                y
            });
            y += 20;
        });

        const total = cotizacion.productos.reduce((sum, producto) => sum + (producto.precio ? producto.precio * producto.cantidad : 0), 0);
        doc.text(`Total: ${total.toFixed(2)}`, { align: 'left', y: y + 10 });

        doc.pipe(res);
        doc.end();
    } catch (error) {
        console.error('Error al generar el PDF:', error);
        res.status(500).send('Error interno al generar el PDF');
    }
});

module.exports = router;
