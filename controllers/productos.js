const express = require('express');
const router = express.Router();
const Producto = require('../models/producto');
const upload = require('../app/upload'); // Middleware de Multer

// Ruta para subir un producto
router.post('/subir-producto', upload.single('imagen'), async (req, res) => {
    try {
        const { nombre, precio, costo, categoria } = req.body;
        const imagen = req.file.filename; // Nombre del archivo subido por Multer

        const nuevoProducto = new Producto({
            nombre,
            precio,
            costo,
            categoria,
            imagen: '/uploads/' + imagen // Ruta donde se guarda la imagen
        });

        await nuevoProducto.save();
        res.status(201).json({ message: 'Producto agregado correctamente' });
    } catch (error) {
        console.error('Error al subir el producto:', error);
        res.status(500).json({ error: 'Error interno al subir el producto' });
    }
});

module.exports = router;
