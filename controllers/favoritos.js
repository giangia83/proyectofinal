const express = require('express');
const router = express.Router();
const Producto = require('../models/producto');
const Usuario = require('../models/usuario');

// Ruta para agregar un producto a favoritos
router.post('/add-to-favorites', async (req, res) => {
    try {
        const { productoId } = req.body;
        const user = res.locals.usuario; // Obtener el usuario desde res.locals

        if (!user) {
            return res.status(401).json({ success: false, message: 'No estás autenticado' });
        }

        // Busca el producto en la base de datos
        const producto = await Producto.findById(productoId);
        if (!producto) {
            return res.status(404).json({ success: false, message: 'Producto no encontrado' });
        }

        // Verifica si el producto ya está en la lista de favoritos
        const isAlreadyFavorite = user.favorites.some(fav => fav._id.equals(producto._id));
        if (isAlreadyFavorite) {
            return res.status(400).json({ success: false, message: 'El producto ya está en favoritos' });
        }

        // Agrega el producto a la lista de favoritos del usuario
        user.favorites.push({
            _id: producto._id,
            nombre: producto.nombre,
            categoria: producto.categoria,
            imagen: {
                data: producto.imagen.data,
                contentType: producto.imagen.contentType
            }
        });

        await Usuario.findByIdAndUpdate(user._id, { favorites: user.favorites });

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});


module.exports = router;
