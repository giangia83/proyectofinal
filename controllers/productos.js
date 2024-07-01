const express = require('express');
const router = express.Router();
const Producto = require('../models/producto');

// Obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Agregar un nuevo producto
router.post('/', async (req, res) => {
    try {
        const { nombre, precio, costo, categoria, imagen } = req.body;

        if (!nombre || !precio || !costo || !categoria || !imagen) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const nuevoProducto = new Producto({
            nombre,
            precio,
            costo,
            categoria,
            imagen
        });

        await nuevoProducto.save();
        res.status(201).json({ mensaje: 'Producto creado exitosamente' });
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Más rutas como editar y eliminar productos según sea necesario

module.exports = router;
