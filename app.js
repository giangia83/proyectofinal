require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const userRouter = require('./controllers/usuarios');
const compression = require('compression');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const app = express();
const port = process.env.PORT || 3001;
const mongoURI = process.env.MONGODB_URI;
/* const multer = require('multer'); */
const fs = require('fs');
const Producto = require("./models/producto")
const AWS = require('aws-sdk');






// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(compression());
// Configuración de sesión
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true, // Debería ser true en producción con HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 día de expiración
    }
}));



// Conexión a la base de datos
mongoose.connect(mongoURI, {
 
})
.then(() => {
    console.log('Conexión a la base de datos establecida');
})
.catch(err => console.error('Error al conectar a la base de datos:', err));





AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-2' // Reemplaza con la región de tu bucket de S3
});

const s3 = new AWS.S3();
const S3_BUCKET_NAME = 'starclean-bucket'; // Reemplaza con el nombre de tu bucket en S3

// Ruta para subir una imagen y guardar un producto
// Ruta para subir un archivo a S3 y guardar detalles del producto
app.post('/upload', async (req, res) => {
    try {
        const { nombre, precio, costo, categoria } = req.body;

        // Verificar si hay archivos en la solicitud
        if (!req.files || !req.files.image) {
            return res.status(400).send('No se ha proporcionado ningún archivo');
        }

        const file = req.files.image;

        const params = {
            Bucket: S3_BUCKET_NAME,
            Key: Date.now().toString() + '-' + file.name,
            Body: file.data,
            ACL: 'public-read',
            ContentType: file.mimetype
        };

        // Subir archivo a S3
        s3.upload(params, async (err, data) => {
            if (err) {
                console.error('Error al subir archivo a S3:', err);
                return res.status(500).send('Error subiendo archivo a S3');
            }

            console.log('Archivo subido correctamente a S3:', data.Location);

            // Guardar detalles del producto en la base de datos
            const newProduct = new Producto({
                nombre,
                precio,
                costo,
                categoria,
                image: {
                    data: data.Location,
                    contentType: file.mimetype
                }
            });

            const savedProduct = await newProduct.save();
            res.json(savedProduct); // Enviar el objeto del producto guardado como respuesta
        });

    } catch (err) {
        console.error('Error al subir archivo o guardar producto:', err);
        res.status(500).send('Error al subir archivo o guardar producto');
    }
});








        
// Rutas de archivos estáticos
app.use('/views', express.static(path.join(__dirname, 'views')));
app.use( 'public', express.static(path.join(__dirname, 'public')));
app.use('/', express.static(path.resolve(__dirname, 'views', 'gestionar')));
app.use('/cuenta', express.static(path.resolve(__dirname, 'views', 'cuenta')));
app.use('/informacion', express.static(path.resolve(__dirname, 'views', 'infocuenta')));
app.use('/iniciarsesion', express.static(path.resolve(__dirname, 'views', 'iniciar')));
app.use('/tuspedidos', express.static(path.resolve(__dirname, 'views', 'pedidos')));
app.use('/registrarse', express.static(path.resolve(__dirname, 'views', 'registrar')));
app.use('/configuracion', express.static(path.resolve(__dirname, 'views', 'plantila-configuracion')));
app.use('/servicioalcliente', express.static(path.resolve(__dirname, 'views', 'serviciocliente')));
app.use('/clientes', express.static(path.resolve(__dirname, 'views', 'clientes')));
app.use('/gestion', express.static(path.resolve(__dirname, 'views', 'gestionar')));
app.use('/administrar', express.static(path.resolve(__dirname, 'views', 'admin')));
app.use('/cotizaciones', express.static(path.resolve(__dirname, 'views', 'cotizaciones')));
app.use('/verproductos', express.static(path.resolve(__dirname, 'views', 'productos')));



// Rutas de API
app.use('/api/users', userRouter);

// Ruta para subir una imagen y guardar un producto
 

// Rutas de autenticación y sesión
app.post('/api/login', async (req, res) => {
    try {
        const { correo, contraseña } = req.body;
        const usuario = await Usuario.findOne({ correo });

        if (!usuario || usuario.contraseña !== contraseña) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        req.session.usuario = {
            nombre: usuario.nombre,
            correo: usuario.correo,
            direccion: usuario.direccion,
            ciudad: usuario.ciudad,
            rif: usuario.rif,
            // Agregar otros datos según sea necesario
        };

        res.status(200).json({ message: 'Inicio de sesión exitoso', usuario });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error interno al iniciar sesión' });
    }
});

// Ruta para subir archivos 

app.get('/cuenta', (req, res) => {
    if (req.session.usuario) {
        console.log(`Bienvenido, ${req.session.usuario.nombre}!`);
        res.render('cuenta', { usuario: req.session.usuario });
    } else {
        res.redirect('/iniciarsesion');
    }
});

app.get('/infocuenta', (req, res) => {
    if (req.session.usuario) {
        res.render('infocuenta', { usuario: req.session.usuario });
    } else {
        res.redirect('/iniciarsesion');
    }
});



// Middleware para servir archivos estáticos en la carpeta de uploads


// Iniciar el servidor
app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
module.exports = app;

