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


// Ruta para obtener un producto por su ID
router.get('/productos/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
        const producto = await Producto.findById(id);
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json(producto);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener el producto' });
    }
});

router.get('/buscar', async (req, res) => {
    const query = req.query.query || '';

    try {
        const productos = await Producto.find({
            $or: [
                { nombre: { $regex: query, $options: 'i' } },
                { categoria: { $regex: query, $options: 'i' } }
            ]
        });
        res.json(productos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al buscar productos' });
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

router.post('/eliminar-productos', async (req, res) => {
    const { id } = req.body;
  
    try {
      await Producto.deleteOne({ _id: id });
      res.redirect('/gestionar'); // Redirige a la lista de productos después de la eliminación
    } catch (error) {
      console.error('Error al eliminar productos:', error);
      res.status(500).json({ message: 'Hubo un error al eliminar el producto' });
    }
});

module.exports = router;
