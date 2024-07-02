require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const userRouter = require('./controllers/usuarios');
const productosRouter = require('./controllers/productos'); // Asegúrate de la ruta correcta
const productosController = require('./controllers/productos'); // Importa el controlador de productos

const uploadMiddleware = require('./middleware/upload');

const compression = require('compression');
const session = require('express-session');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const Producto = require('./models/producto');
const app = express();
const port = process.env.PORT || 3001;
const mongoURI = process.env.MONGODB_URI;

// Configuración de Multer
// Configuración de Handlebars como motor de plantillas
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

app.use('/api/productos', productosRouter); // Monta el enrutador de productos
app.post('/api/subir-producto', productosController.subirProducto, productosController.guardarProducto);



app.post('/subir-producto', uploadMiddleware, (req, res) => {
    fs.readFile(req.file.path, (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error al leer la imagen');
      }
      var encode_image = data.toString('base64');
      var finalImg = {
        contentType: req.file.mimetype,
        image: Buffer.from(encode_image, 'base64')
      };
  
      MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
        if (err) {
          console.error('Error al conectar con MongoDB:', err);
          return res.status(500).send('Error interno del servidor');
        }
        
        const db = client.db(); // Aquí especifica el nombre de la base de datos si es diferente a `mongoURI`
        db.collection('quotes').insertOne(finalImg, (err, result) => {
          if (err) {
            client.close();
            console.error('Error al insertar en la base de datos:', err);
            return res.status(500).send('Error al guardar la imagen en la base de datos');
          }
          
          client.close();
          console.log('Imagen guardada en la base de datos');
          res.redirect('/');
        });
      });
    });
  });


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

// Exportar upload para que esté disponible en otros archivos

