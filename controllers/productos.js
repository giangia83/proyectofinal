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

router.post('/eliminar-productos', async (req, res) => {
    const { ids } = req.body;
  
    try {
      await Producto.deleteMany({ _id: { $in: ids } });
      res.json({ success: true });
    } catch (error) {
      console.error('Error al eliminar productos:', error);
      res.json({ success: false, error: 'Hubo un error al eliminar los productos' });
    }
  });

module.exports = router;
