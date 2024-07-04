// routes/productos.js
const express = require('express');
const router = express.Router();
const Producto = require('../models/producto');

// Ruta para obtener todos los productos (API)
router.get('/productos', async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener productos' });
    }
});

// Ruta para renderizar la vista 'productos/index' con los productos
router.get('/verproductos', async (req, res) => {
    try {
        const productos = await Producto.find();
        res.render('productos/index', { productos }); // Renderiza la vista 'productos/index' con los productos obtenidos
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener productos' });
    }
});

module.exports = router;
