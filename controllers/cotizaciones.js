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

        // Encabezado de la factura
        doc.fontSize(20).text('Starclean C.A', { align: 'center', underline: true });
        doc.fontSize(14).text('Cotización', { align: 'center', margin: [0, 10] });
        doc.moveDown();

        // Datos del cliente
        doc.fontSize(12).text(`Cliente: ${cotizacion.usuarioNombre}`, { align: 'left' });
        doc.text(`Dirección: ${cotizacion.usuario.direccion}`);
        doc.text(`Correo: ${cotizacion.usuario.correo}`);
        doc.text(`Teléfono: ${cotizacion.usuario.number}`);
        doc.moveDown();

        // Tabla de productos
        doc.fontSize(12).text('Productos:', { underline: true });
        doc.moveDown();

        // Encabezado de la tabla
        const tableTop = doc.y;
        const table = {
            x: 50,
            y: tableTop,
            width: 500,
            headerHeight: 20,
            rowHeight: 18,
            fontSize: 10,
            columns: [
                { title: 'Descripción', width: 250 },
                { title: 'Cantidad', width: 80, align: 'right' },
                { title: 'Precio Unitario', width: 100, align: 'right' },
                { title: 'Subtotal', width: 100, align: 'right' },
            ]
        };

        doc.fontSize(table.fontSize);

        // Draw header
        table.columns.forEach((column, i) => {
            doc.rect(table.x + column.width * i, table.y, column.width, table.headerHeight)
                .stroke();
            doc.text(column.title, table.x + column.width * i + 5, table.y + 5);
        });

        // Draw rows
        let y = table.y + table.headerHeight;
        let total = 0;
        cotizacion.productos.forEach((producto, index) => {
            const subtotal = producto.precio ? producto.precio * producto.cantidad : 0;
            total += subtotal;

            doc.rect(table.x, y, table.width, table.rowHeight)
                .stroke();
            doc.text(producto.nombre, table.x + 5, y + 5, { width: table.columns[0].width - 10 });
            doc.text(producto.cantidad.toString(), table.x + table.columns[1].width - 5, y + 5, { align: 'right' });
            doc.text(producto.precio ? producto.precio.toFixed(2) : 'N/A', table.x + table.columns[2].width - 5, y + 5, { align: 'right' });
            doc.text(subtotal.toFixed(2), table.x + table.columns[3].width - 5, y + 5, { align: 'right' });

            y += table.rowHeight;
        });

        doc.rect(table.x, y, table.width, 20)
            .stroke();
        doc.text('Total:', table.x + table.columns[0].width + 5, y + 5);
        doc.text(total.toFixed(2), table.x + table.columns[3].width - 5, y + 5, { align: 'right' });

        // Finalizar el documento
        doc.end();
    } catch (error) {
        console.error('Error al generar el PDF:', error);
        res.status(500).send('Error interno al generar el PDF');
    }
});


module.exports = router;
