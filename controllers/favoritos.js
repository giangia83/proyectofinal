const express = require('express');
const router = express.Router();
const Producto = require('../models/producto');
const Usuario = require('../models/usuario');

router.post('/add-to-favorites', async (req, res) => {
    try {
        const { productoId } = req.body;
        console.log('ID del producto recibido:', productoId); // Añadir esta línea para depurar
        const user = res.locals.usuario; // Obtener el usuario desde res.locals

        if (!user) {
            console.log('No hay usuario autenticado.');
            return res.status(401).json({ success: false, message: 'No estás autenticado' });
        }

        // Obtén el usuario actualizado desde la base de datos
        const usuario = await Usuario.findById(user._id);
        console.log('Usuario encontrado:', usuario); // Añadir esta línea para depurar
        if (!usuario) {
            console.log('Usuario no encontrado:', user._id);
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        // Busca el producto en la base de datos
        const producto = await Producto.findById(productoId);
        console.log('Producto encontrado:', producto); // Añadir esta línea para depurar
        if (!producto) {
            console.log('Producto no encontrado:', productoId);
            return res.status(404).json({ success: false, message: 'Producto no encontrado' });
        }

        // Verifica si el producto ya está en la lista de favoritos
        const isAlreadyFavorite = usuario.favorites.some(fav => fav._id.toString() === producto._id.toString());
        console.log('¿Ya es favorito?:', isAlreadyFavorite); // Añadir esta línea para depurar
        if (isAlreadyFavorite) {
            console.log('El producto ya está en favoritos:', producto._id);
            return res.status(400).json({ success: false, message: 'El producto ya está en favoritos' });
        }

        // Agrega el producto a la lista de favoritos del usuario
        usuario.favorites.push({
            _id: producto._id,
            nombre: producto.nombre,
            categoria: producto.categoria,
            imagen: producto.imagen.data // Asegúrate de que `producto.imagen` tenga la información necesaria
        });

        // Actualiza el usuario con el nuevo favorito
        await usuario.save();
        console.log('Producto agregado a favoritos:', producto._id);

        // Devuelve el producto como parte de la respuesta
        res.json({ success: true, producto: {
            _id: producto._id,
            nombre: producto.nombre,
            categoria: producto.categoria,
            imagen: producto.imagen // Devuelve la información de la imagen
        }});
    } catch (error) {
        console.error('Error al agregar a favoritos:', error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});





// En tu archivo de rutas, por ejemplo `favoritos.js`
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

        res.json({ success: true, favorites: usuario.favorites });
    } catch (error) {
        console.error('Error al obtener favoritos:', error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});



module.exports = router;
