const express = require('express');
const multer = require('multer');
const axios = require('axios');
const path = require('path');

const router = express.Router();

// Configura multer para manejar archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Configuración de Bunny.net
const bunnyStorageUrl = 'https://storage.bunnycdn.com/starclean'; // Reemplaza con tu zona de almacenamiento
const bunnyAccessKey = 'YOUR_BUNNYNET_ACCESS_KEY'; // Reemplaza con tu clave de acceso

// Ruta para subir archivos
router.post('/upload', upload.single('inputImagen'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se ha cargado ningún archivo' });
    }

    try {
        // Configura el nombre del archivo y la URL de destino
        const fileName = req.file.originalname;
        const fileUrl = `${bunnyStorageUrl}/${fileName}`;

        // Sube el archivo a Bunny.net
        const response = await axios.put(fileUrl, req.file.buffer, {
            headers: {
                'Content-Type': 'application/octet-stream', // Tipo de contenido para archivos binarios
                'AccessKey': bunnyAccessKey, // Clave de acceso para Bunny.net
            },
        });

        // Verifica el estado de la respuesta para asegurarse de que la carga fue exitosa
        if (response.status === 200 || response.status === 201) {
            // Devuelve la URL del archivo subido
            res.json({ url: fileUrl });
        } else {
            res.status(response.status).json({ error: 'Error al subir el archivo' });
        }
    } catch (err) {
        console.error('Error al subir el archivo:', err.message);
        res.status(500).json({ error: 'Error al subir el archivo' });
    }
});

module.exports = router;
