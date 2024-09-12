const express = require('express');
const multer = require('multer');
const axios = require('axios');
const sharp = require('sharp');
const mongoose = require('mongoose');
const Producto = require('../models/producto');
require('dotenv').config();
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });
const bunnyStorageUrl = 'https://br.storage.bunnycdn.com/starcleanbucket';
const bunnyPullZoneUrl = 'https://starcleanpull.b-cdn.net';
const bunnyAccessKey = process.env.YOUR_BUNNYNET_ACCESS_KEY;
const IMAGE_WIDTH = 300;
const IMAGE_HEIGHT = 300;

// Ruta para subir un nuevo producto
router.post('/upload', upload.single('inputImagen'), async (req, res) => {
    if (!req.file) {
        const errorMsg = 'No se ha cargado ningún archivo';
        console.error(errorMsg);
        return res.status(400).json({ error: errorMsg });
    }

    try {
        const fileName = req.file.originalname.replace(/\.[^/.]+$/, '') + '.webp';
        
       /* este codigo recorta la imagen si es necesario */
        const fileBuffer = await sharp(req.file.buffer)
            .resize(IMAGE_WIDTH, IMAGE_HEIGHT, {
                fit: 'cover'  
            })
            .webp()
            .toBuffer();

        const response = await axios.put(
            `${bunnyStorageUrl}/${fileName}`,
            fileBuffer,
            {
                headers: {
                    'Content-Type': 'image/webp',
                    'AccessKey': bunnyAccessKey,
                },
            }
        );

        if (response.status === 200 || response.status === 201) {
            const fileUrl = `${bunnyPullZoneUrl}/${fileName}`;
            const nuevoProducto = new Producto({
                nombre: req.body.nombre,
                costo: req.body.costo,
                precio: req.body.precio,
                imagen: {
                    data: fileUrl,
                    contentType: 'image/webp'
                },
                categoria: req.body.categoria
            });

            await nuevoProducto.save();
            res.json({ url: fileUrl, mensaje: 'Producto subido y guardado exitosamente' });
        } else {
            const errorMsg = `Error al subir el archivo. Código de estado: ${response.status}`;
            console.error(errorMsg);
            res.status(response.status).json({ error: errorMsg });
        }
    } catch (err) {
        if (err.response) {
            console.error(`Error en la respuesta de Bunny.net:`, err.response.status, err.response.data);
            res.status(err.response.status).json({
                error: `Error en la respuesta de Bunny.net`,
                details: err.response.data
            });
        } else if (err.request) {
            console.error('Error en la solicitud a Bunny.net:', err.request);
            res.status(500).json({ error: 'Error en la solicitud a Bunny.net. Verifica la conexión de red.' });
        } else {
            console.error('Error inesperado:', err.message);
            res.status(500).json({ error: 'Error inesperado. Por favor, intenta nuevamente.' });
        }
    }
});

// Ruta para actualizar un producto existente
router.post('/actualizar-producto', upload.single('imagen'), async (req, res) => {
    const { id, nombre, costo, precio, categoria } = req.body;
    const file = req.file;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'ID de producto no válido' });
    }

    try {
        let fileUrl = null;

        if (file) {
            const fileName = file.originalname.replace(/\.[^/.]+$/, '') + '.webp';

          
            const fileBuffer = await sharp(file.buffer)
                .resize(IMAGE_WIDTH, IMAGE_HEIGHT, {
                    fit: 'cover'  
                })
                .webp()
                .toBuffer();

            const response = await axios.put(
                `${bunnyStorageUrl}/${fileName}`,
                fileBuffer,
                {
                    headers: {
                        'Content-Type': 'image/webp',
                        'AccessKey': bunnyAccessKey,
                    },
                }
            );

            if (response.status === 200 || response.status === 201) {
                fileUrl = `${bunnyPullZoneUrl}/${fileName}`;
            } else {
                throw new Error(`Error al subir el archivo. Código de estado: ${response.status}`);
            }
        }

        const updateData = {
            nombre,
            costo,
            precio,
            categoria,
            ...(fileUrl && { imagen: { data: fileUrl, contentType: 'image/webp' } })
        };

        const updatedProducto = await Producto.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedProducto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json({ mensaje: 'Producto actualizado exitosamente', producto: updatedProducto });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

module.exports = router;
