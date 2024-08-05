const express = require('express');
const router = express.Router();
const Cotizacion = require('../models/cotizacion');

const Producto = require('../models/producto')
// Ruta para obtener todas las cotizaciones
// Ruta para obtener todas las cotizaciones
router.get('/vercotizaciones', async (req, res) => {
    try {
        const productos = await Producto.find();
        const cotizaciones = await Cotizacion.find().populate('usuario'); // Llenar el campo de usuario con los detalles del usuario

        // Mapear las cotizaciones para agregar el nombre del usuario en lugar del ID
        const cotizacionesConNombre = cotizaciones.map(cotizacion => ({
            ...cotizacion.toObject(),
            usuarioNombre: cotizacion.usuario.nombre // Agregar el nombre del usuario
        }));

        res.render('cotizaciones/index', {
            productos,
            cotizaciones: cotizacionesConNombre
         
        });
    } catch (error) {
        console.error('Error al obtener cotizaciones:', error);
        res.status(500).send('Error interno al obtener cotizaciones');
    }
});

router.post('/vercotizaciones/verificar/:id', async (req, res) => {
    const { id } = req.params;
    try {
        console.log(`Intentando verificar cotización con ID: ${id}`);
        const cotizacion = await Cotizacion.findById(id);
        if (!cotizacion) {
            console.log('Cotización no encontrada');
            return res.status(404).send('Cotización no encontrada');
        }
        cotizacion.estado = 'Verificada';
        await cotizacion.save();
        console.log('Cotización verificada con éxito');
        res.redirect('/vercotizaciones');
    } catch (error) {
        console.error('Error al verificar cotización:', error);
        res.status(500).send('Error interno al verificar cotización');
    }
});

// Ruta para eliminar una cotización
router.post('/vercotizaciones/eliminar/:id', async (req, res) => {
    const { id } = req.params;
    const redirectUrl = '/vercotizaciones'; // Usa '/vercotizaciones' como valor por defecto

    try {
        await Cotizacion.findByIdAndDelete(id);
        res.redirect(redirectUrl); // Redirigir a la URL proporcionada o a '/vercotizaciones'
    } catch (error) {
        console.error('Error al eliminar cotización:', error);
        res.status(500).send('Error interno al eliminar cotización');
    }
});




module.exports = router;
