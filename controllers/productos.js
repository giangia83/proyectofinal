const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload')
const Producto = require('../models/producto'); // Asegúrate de importar el modelo Producto




// Ruta para subir un producto con imagen
router.post('/api/subir-producto', upload.single('imagen'), async (req, res) => {
    // Verificar si se subió correctamente el archivo
    if (!req.file) {
        return res.status(400).json({ error: 'No se ha seleccionado ningún archivo para subir.' });
    }

    // Crear un nuevo producto con la información recibida
    const nuevoProducto = new Producto({
        nombre: req.body.nombre,
        precio: req.body.precio,
        costo: req.body.costo,
        categoria: req.body.categoria,
        imagen: req.file.path.replace('public', '') // Guarda la ruta de la imagen (URL relativa)
    });

    try {
        // Guardar el nuevo producto en la base de datos
        const productoGuardado = await nuevoProducto.save();
        res.status(201).json({ mensaje: 'Producto subido correctamente', producto: productoGuardado });
    } catch (error) {
        console.error('Error al guardar el producto:', error);
        res.status(500).json({ error: 'Error interno al guardar el producto' });
    }
});

module.exports = router;
