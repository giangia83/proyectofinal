const express = require('express');
const router = express.Router();
const Producto = require('../models/producto');
const Usuario = require('../models/usuario');
const mongoose = require('mongoose');


router.post('/add-to-favorites', async (req, res) => {
    try {
        const { productoId } = req.body;
        const user = res.locals.usuario;

        if (!user) {
            return res.status(401).json({ success: false, message: 'No estás autenticado' });
        }

        const usuario = await Usuario.findById(user._id);
        if (!usuario) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        const producto = await Producto.findById(productoId);
        if (!producto) {
            return res.status(404).json({ success: false, message: 'Producto no encontrado' });
        }

        if (usuario.favorites.includes(productoId)) {
            return res.status(400).json({ success: false, message: 'El producto ya está en favoritos' });
        }

        usuario.favorites.push(productoId);
        await usuario.save();

        res.json({ success: true, producto: {
            _id: producto._id,
            nombre: producto.nombre,
            categoria: producto.categoria,
            imagen: producto.imagen.data.toString('base64') // Convierte el buffer a base64
        }});
    } catch (error) {
        console.error('Error al agregar a favoritos:', error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});


router.get('/get-favorites', async (req, res) => {
    try {
        const user = res.locals.usuario;
        if (!user) {
            return res.status(401).json({ success: false, message: 'No estás autenticado' });
        }

        const usuario = await Usuario.findById(user._id).populate('favorites');
        if (!usuario) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        const favorites = usuario.favorites.map(producto => ({
            _id: producto._id,
            nombre: producto.nombre,
            categoria: producto.categoria,
            imagen: producto.imagen.data.toString('base64') // Convierte el buffer a base64
        }));

        res.json({ success: true, favorites });
    } catch (error) {
        console.error('Error al obtener favoritos:', error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});
router.post('/remove-from-favorites', async (req, res) => {
    try {
        const { productoId } = req.body;
        const user = res.locals.usuario;

        if (!user) {
            return res.status(401).json({ success: false, message: 'No estás autenticado' });
        }

        const usuario = await Usuario.findById(user._id);
        if (!usuario) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        const productoObjectId = mongoose.Types.ObjectId(productoId);
        const index = usuario.favorites.indexOf(productoObjectId.toString());

        if (index === -1) {
            return res.status(400).json({ success: false, message: 'El producto no está en favoritos' });
        }

        usuario.favorites.splice(index, 1);
        await usuario.save();

        res.json({ success: true, message: 'Producto eliminado de favoritos' });
    } catch (error) {
        console.error('Error al eliminar de favoritos:', error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});

module.exports = router;
