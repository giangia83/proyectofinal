const express = require('express');
const router = express.Router();
const Cotizacion = require('../models/cotizacion');
const Producto = require('../models/producto');

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



module.exports = router;
