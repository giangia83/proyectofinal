const express = require('express');
const router = express.Router();
const Producto = require('../models/producto');
const Usuario = require('../models/usuario');
// Código del servidor
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

        const isAlreadyFavorite = usuario.favorites.some(fav => fav._id.toString() === producto._id.toString());
        if (isAlreadyFavorite) {
            return res.status(400).json({ success: false, message: 'El producto ya está en favoritos' });
        }

        // Agrega el producto a la lista de favoritos
        usuario.favorites.push({
            _id: producto._id,
            nombre: producto.nombre,
            categoria: producto.categoria,
            imagen: producto.imagen // Asegúrate de enviar la URL de la imagen si es necesario
        });

        await usuario.save();

        res.json({ success: true, producto: {
            _id: producto._id,
            nombre: producto.nombre,
            categoria: producto.categoria,
            imagen: producto.imagen ? {
                url: `/images/${producto._id}`, // Ejemplo de URL pública para la imagen
                contentType: producto.imagen.contentType
            } : null
        }});
    } catch (error) {
        console.error('Error al agregar a favoritos:', error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
});


module.exports = router;
