const express = require('express');
const router = express.Router();
const Cotizacion = require('../models/cotizacion');
const Producto = require('../models/producto');
const { jsPDF } = require('jspdf');
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

        cotizacion.estado = 'Pendiente'; // Cambia el estado si es necesario
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

        const cotizacion = await Cotizacion.findById(id).populate('productos');
        if (!cotizacion) {
            return res.status(404).send('Cotización no encontrada');
        }

        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text(`Cotización ID: ${cotizacion._id}`, 10, 10);
        doc.text(`Usuario: ${cotizacion.usuario.nombre}`, 10, 20);
        doc.text(`Dirección: ${cotizacion.usuario.direccion}`, 10, 30);

        doc.setFontSize(14);
        doc.text('Productos:', 10, 40);
        let y = 50;
        cotizacion.productos.forEach((producto, index) => {
            doc.text(`${index + 1}. ${producto.nombre} - Cantidad: ${producto.cantidad} - Precio Unitario: ${producto.precio}`, 10, y);
            y += 10;
        });

        const total = cotizacion.productos.reduce((sum, producto) => sum + producto.precio * producto.cantidad, 0);
        doc.text(`Total: ${total.toFixed(2)}`, 10, y + 10);

        // Envía el PDF como una respuesta
        const pdfOutput = doc.output('blob');
        res.setHeader('Content-Disposition', `attachment; filename=cotizacion_${id}.pdf`);
        res.setHeader('Content-Type', 'application/pdf');
        res.send(pdfOutput);
    } catch (error) {
        console.error('Error al generar el PDF:', error);
        res.status(500).send('Error interno al generar el PDF');
    }
});

module.exports = router;
