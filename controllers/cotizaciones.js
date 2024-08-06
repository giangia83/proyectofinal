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
router.get('/vercotizaciones/pdf/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Asegúrate de que el ID sea una cadena de 24 caracteres
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send('ID de cotización inválido');
        }

        const cotizacion = await Cotizacion.findById(id).populate('usuario');
        if (!cotizacion) {
            return res.status(404).send('Cotización no encontrada');
        }

        // Crear un nuevo documento PDF
        const doc = new PDFDocument({ margin: 50 });
        let filename = `cotizacion_${id}.pdf`;
        filename = encodeURI(filename);

        // Enviar el PDF como respuesta
        res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-type', 'application/pdf');

        // Título y datos del usuario
        doc.fontSize(20).text('Cotización', { align: 'center' });
        doc.moveDown();

        doc.fontSize(14).text(`Cotización ID: ${cotizacion._id}`, { align: 'right' });
        doc.moveDown();

        doc.fontSize(12).text(`Usuario: ${cotizacion.usuario.nombre}`);
        doc.text(`Correo: ${cotizacion.usuario.correo}`);
        doc.text(`Dirección: ${cotizacion.usuario.direccion}`);
        doc.text(`Ciudad: ${cotizacion.usuario.ciudad}`);
        doc.text(`RIF: ${cotizacion.usuario.rif}`);
        doc.text(`Número de Teléfono: ${cotizacion.usuario.number}`);
        doc.moveDown();

        // Encabezado de la tabla de productos
        doc.fontSize(12).text('Productos:', { underline: true });
        doc.moveDown();

        // Crear la tabla de productos
        const tableTop = 200;
        const itemCodeX = 50;
        const descriptionX = 150;
        const quantityX = 350;
        const unitPriceX = 400;
        const lineTotalX = 500;

        doc.fontSize(10).text('Código', itemCodeX, tableTop, { bold: true });
        doc.text('Descripción', descriptionX, tableTop);
        doc.text('Cantidad', quantityX, tableTop);
        doc.text('Precio Unitario', unitPriceX, tableTop);
        doc.text('Total', lineTotalX, tableTop);
        doc.moveDown();

        let y = tableTop + 20;
        cotizacion.productos.forEach((producto, index) => {
            const totalProducto = producto.precio * producto.cantidad;
            doc.text(producto.id, itemCodeX, y);
            doc.text(producto.nombre, descriptionX, y);
            doc.text(producto.cantidad, quantityX, y);
            doc.text(producto.precio.toFixed(2), unitPriceX, y);
            doc.text(totalProducto.toFixed(2), lineTotalX, y);
            y += 20;
        });

        // Total de la cotización
        const total = cotizacion.productos.reduce((sum, producto) => sum + (producto.precio ? producto.precio * producto.cantidad : 0), 0);
        doc.fontSize(12).text(`Total: ${total.toFixed(2)}`, { align: 'right', y: y + 20 });

        // Finalizar y enviar el PDF
        doc.pipe(res);
        doc.end();
    } catch (error) {
        console.error('Error al generar el PDF:', error);
        res.status(500).send('Error interno al generar el PDF');
    }
});

module.exports = router;
