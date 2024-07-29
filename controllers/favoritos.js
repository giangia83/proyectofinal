const express = require('express');
const router = express.Router();
const Producto = require('../models/producto');
const Usuario = require('../models/usuario');

router.post('/add-to-favorites', async (req, res) => {
    try {
        const { productoId } = req.body;
        const user = res.locals.usuario; // Obtener el usuario desde res.locals

        if (!user) {
            console.log('No hay usuario autenticado.');
            return res.status(401).json({ success: false, message: 'No estás autenticado' });
        }

        // Obtén el usuario actualizado desde la base de datos
        const usuario = await Usuario.findById(user._id);
        if (!usuario) {
            console.log('Usuario no encontrado:', user._id);
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        // Verificar que `usuario.favorites` sea una matriz
        if (!Array.isArray(usuario.favorites)) {
            console.log('Inicializando favorites como una matriz vacía.');
            usuario.favorites = [];
        }

        // Busca el producto en la base de datos
        const producto = await Producto.findById(productoId);
        if (!producto) {
            console.log('Producto no encontrado:', productoId);
            return res.status(404).json({ success: false, message: 'Producto no encontrado' });
        }

        // Verifica si el producto ya está en la lista de favoritos
        const isAlreadyFavorite = usuario.favorites.some(fav => fav._id.toString() === producto._id.toString());
        if (isAlreadyFavorite) {
            console.log('El producto ya está en favoritos:', producto._id);
            return res.status(400).json({ success: false, message: 'El producto ya está en favoritos' });
        }

        // Agrega el producto a la lista de favoritos del usuario
        usuario.favorites.push({
            _id: producto._id,
            nombre: producto.nombre,
            categoria: producto.categoria,
            imagen: {
                data: producto.imagen.data,
                contentType: producto.imagen.contentType
            }
        });

        // Actualiza el usuario con el nuevo favorito
        await usuario.save();
        console.log('Producto agregado a favoritos:', producto._id);

        res.json({ success: true });
    } catch (error) {
        console.error('Error al agregar a favoritos:', error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});

module.exports = router;
