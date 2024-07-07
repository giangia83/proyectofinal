const express = require('express');
const router = express.Router();
const Cotizacion = require('../models/cotizacion');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto')
// Ruta para obtener todas las cotizaciones
router.get('/vercotizaciones', async (req, res) => {
    try {
        const productos = await Producto.find();
        const usuario = await Usuario.findById(id);
        const cotizaciones = await Cotizacion.find();
        res.render('cotizaciones/index', {productos, cotizaciones, usuario });
    } catch (error) {
        console.error('Error al obtener cotizaciones:', error);
        res.status(500).send('Error interno al obtener cotizaciones');
    }
});

// Ruta para actualizar el estado de una cotización a "Verificada"
router.post('/vercotizaciones/verificar/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const cotizacion = await Cotizacion.findById(id);
        if (!cotizacion) {
            return res.status(404).send('Cotización no encontrada');
        }
        cotizacion.estado = 'Verificada';
        await cotizacion.save();
        res.redirect('/vercotizaciones'); // Redirigir de vuelta a la lista de cotizaciones
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
        res.redirect('/vercotizaciones'); // Redirigir de vuelta a la lista de cotizaciones
    } catch (error) {
        console.error('Error al eliminar cotización:', error);
        res.status(500).send('Error interno al eliminar cotización');
    }
});

// Ruta para obtener detalles de un usuario por ID
router.get('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const usuario = await Usuario.findById(id);
        if (!usuario) {
            return res.status(404).send('Usuario no encontrado');
        }
        res.render('usuario-detalle', { usuario });
    } catch (error) {
        console.error('Error al obtener detalles del usuario:', error);
        res.status(500).send('Error interno al obtener detalles del usuario');
    }
});

module.exports = router;
