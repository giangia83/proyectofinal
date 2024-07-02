const express = require('express');
const router = express.Router();
const Producto = require('../models/producto');

// Middleware para manejar la subida de imagen y guardar el producto
async function subirProducto(req, res, next) {
    try {
        // Verificar si se subió correctamente el archivo
        if (!req.file) {
            return res.status(400).json({ error: 'No se ha seleccionado ningún archivo para subir.' });
        }
        next(); // Llamar a la siguiente función en la cadena de middleware
    } catch (error) {
        console.error('Error en subirProducto middleware:', error);
        res.status(500).json({ error: 'Error interno en el middleware de subida de producto' });
    }
}

async function guardarProducto(req, res) {
    try {
        // Crear un nuevo producto con la información recibida
        const nuevoProducto = new Producto({
            nombre: req.body.nombre,
            precio: req.body.precio,
            costo: req.body.costo,
            categoria: req.body.categoria,
            imagen: {
                data: req.file.buffer,
                contentType: req.file.mimetype
            }
        });

        // Guardar el nuevo producto en la base de datos
        const productoGuardado = await nuevoProducto.save();
        res.status(201).json({ mensaje: 'Producto subido correctamente', producto: productoGuardado });
    } catch (error) {
        console.error('Error al guardar el producto:', error);
        res.status(500).json({ error: 'Error interno al guardar el producto' });
    }
}

async function obtenerProductos(req, res) {
    try {
        const productos = await Producto.find();
        res.status(200).json(productos);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).json({ error: 'Error interno al obtener los productos' });
    }
}

async function obtenerProductoPorId(req, res) {
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
}

async function actualizarProducto(req, res) {
    const { id } = req.params;
    const { nombre, precio, costo, categoria, imagen } = req.body;
    try {
        // Verificar si se subió una nueva imagen
        const producto = await Producto.findById(id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado para actualizar' });
        }

        // Actualizar los campos del producto
        producto.nombre = nombre;
        producto.precio = precio;
        producto.costo = costo;
        producto.categoria = categoria;
        if (req.file) {
            producto.imagen = {
                data: req.file.buffer,
                contentType: req.file.mimetype
            };
        }

        // Guardar el producto actualizado en la base de datos
        const productoActualizado = await producto.save();
        res.status(200).json({ mensaje: 'Producto actualizado correctamente', producto: productoActualizado });
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ error: 'Error interno al actualizar el producto' });
    }
}

async function eliminarProducto(req, res) {
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
}

module.exports = {
    subirProducto,
    guardarProducto,
    obtenerProductos,
    obtenerProductoPorId,
    actualizarProducto,
    eliminarProducto
};
