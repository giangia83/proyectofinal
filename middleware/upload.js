const express = require('express');
const router = express.Router();


const multer = require('multer');

// Configuración de Multer para la subida de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
});

const upload = multer({ storage: storage });

module.exports = upload;




// Ruta para subir un producto con imagen
router.post('/api/subir-producto', upload.single('imagen'), async (req, res) => {
    // Verificar si se subió correctamente el archivo
    if (!req.file) {
        return res.status(400).json({ error: 'No se ha seleccionado ningún archivo para subir.' });
    }

    // Crear un nuevo producto con la información recibida
    const nuevoProducto = new Producto({
        nombre: req.body.nombre,
        precio: req.body.precio,
        costo: req.body.costo,
        categoria: req.body.categoria,
        imagen: req.file.path.replace('public', '') // Guarda la ruta de la imagen (URL relativa)
    });

    try {
        // Guardar el nuevo producto en la base de datos
        const productoGuardado = await nuevoProducto.save();
        res.status(201).json({ mensaje: 'Producto subido correctamente', producto: productoGuardado });
    } catch (error) {
        console.error('Error al guardar el producto:', error);
        res.status(500).json({ error: 'Error interno al guardar el producto' });
    }
});

module.exports = upload;
