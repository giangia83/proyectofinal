const express = require('express');
const router = express.Router();
const Producto = require('../models/producto');
const productosController = require('../controllers/productos');

// Middleware para manejar la subida de imagen y guardar el producto
router.post('/', productosController.subirProducto, productosController.guardarProducto);

// Ruta para obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const productos = await Producto.find();
        res.status(200).json(productos);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).json({ error: 'Error interno al obtener los productos' });
    }
});

// Ruta para obtener un producto por su ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const producto = await Producto.findById(id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.status(200).json(producto);
    } catch (error) {
        console.error('Error al obtener el producto por ID:', error);
        res.status(500).json({ error: 'Error interno al obtener el producto por ID' });
    }
});

// Ruta para actualizar un producto por su ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, precio, costo, categoria, imagen } = req.body;
    try {
        const productoActualizado = await Producto.findByIdAndUpdate(id, {
            nombre,
            precio,
            costo,
            categoria,
            imagen
        }, { new: true }); // { new: true } indica que queremos el documento actualizado
        if (!productoActualizado) {
            return res.status(404).json({ error: 'Producto no encontrado para actualizar' });
        }
        res.status(200).json({ mensaje: 'Producto actualizado correctamente', producto: productoActualizado });
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ error: 'Error interno al actualizar el producto' });
    }
});

// Ruta para eliminar un producto por su ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const productoEliminado = await Producto.findByIdAndDelete(id);
        if (!productoEliminado) {
            return res.status(404).json({ error: 'Producto no encontrado para eliminar' });
        }
        res.status(200).json({ mensaje: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ error: 'Error interno al eliminar el producto' });
    }
});

module.exports = router;
