require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const userRouter = require('./controllers/usuarios');
const iniciarSesion = require('./controllers/iniciarSesion')
const productosRouter = require('./controllers/productos');
const cotizacionesRouter = require('./controllers/cotizaciones'); // Ruta relativa al archivo cotizaciones.js
const Cotizacion = require('./models/cotizacion');
const compression = require('compression');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const app = express();
const port = process.env.PORT || 3001;
const mongoURI = process.env.MONGODB_URI;
const fs = require('fs');
const Producto = require("./models/producto")
const Usuario = require("./models/usuario")
const methodOverride = require('method-override');
const subirProducto = require('./controllers/subirProducto')
const favoritoRouter = require('./controllers/favoritos'); // Importa las rutas de favoritos
const enviarCorreoCotizacion = require('./controllers/email');
const uploadDirectory = path.join(__dirname, 'uploads');
// Crear la carpeta uploads si no existe
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory);
}
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Middleware para parsear datos de formularios HTML
app.use(cookieParser());
app.use(compression());
app.use(methodOverride('_method'));
// Configuración de sesión
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true, 
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 día de expiración
        sameSite: 'lax'
    }
}));

// Conexión a la base de datos
mongoose.connect(mongoURI, {
 
})
.then(() => {
    console.log('Conexión a la base de datos establecida');
})
.catch(err => console.error('Error al conectar a la base de datos:', err));
//storage 
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
    // Obtener el nombre de usuario desde la cookie 'usuario'
    const usuarioNombre = req.cookies.usuario;
    // Verificar si hay un nombre de usuario en la cookie
    if (usuarioNombre) {
        // Consultar la base de datos para obtener los detalles del usuario
        Usuario.findOne({ nombre: usuarioNombre })
            .then(usuario => {
                if (usuario) {
                    // Si encontramos al usuario, configuramos res.locals.usuario con sus detalles
                    res.locals.usuario = {
                        _id: usuario._id,  // Añadir el _id del usuario
                        nombre: usuario.nombre,
                        correo: usuario.correo,
                        direccion: usuario.direccion,
                        number: usuario.number,
                        rif: usuario.rif,
                        ciudad: usuario.ciudad,
                        esAdmin: usuario.rol === 'admin'       
                        // Otros campos del usuario que desees mostrar
                    };
                } else {
                    // Manejar el caso en el que no se encuentre el usuario
                    delete res.locals.usuario; // Asegurarse de no definir res.locals.usuario
                }
                next();
            })
            .catch(error => {
                console.error('Error al obtener el usuario:', error);
                delete res.locals.usuario; // Manejar errores de consulta a la base de datos
                next();
            });
    } else {
        delete res.locals.usuario; // Si no hay cookie de usuario, asegurarse de no definir res.locals.usuario
        next();
    }
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.set('view engine', 'ejs');
app.use('/views', express.static(path.join(__dirname, 'views')));

/* rutas */
app.get('/verproductos', async (req, res) => {
    try {
        const productos = await Producto.find(); // Obtener todos los productos desde la base de datos
        res.render('productos/index', { productos,  usuario: res.locals.usuario || { nombre: '' } }); // Renderizar la vista 'productos/index' con los productos obtenidos
    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).send('Error al obtener productos');
    }
});

// En tu archivo principal de la aplicación (app.js o index.js)
app.get('/', async (req, res) => {
    try {
        const productos = await Producto.find(); // Obtener todos los productos desde la base de datos
        res.render('home/index', { productos,  usuario: res.locals.usuario || { nombre: '' } }); // Renderizar la vista 'productos/index' con los productos obtenidos
    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).send('Error al obtener productos');
    }
});

// Ruta para renderizar la página de servicio al cliente
app.get('/servicioalcliente', async (req, res) => {
    try {
    
        const usuarioAdmin = await Usuario.findOne({ correo: "jbiadarola@hotmail.com" });

        // Verificar si se encontró el usuario admin
        if (!usuarioAdmin) {
            return res.status(404).send('Usuario admin no encontrado');
        }

      
        res.render('serviciocliente/index', { usuario: usuarioAdmin });
    } catch (error) {
        console.error('Error al obtener el usuario admin:', error);
        res.status(500).send('Error al obtener el usuario admin');
    }
});

app.get('/gestionar', verificarAdmin, async (req, res) => {
    try {
        const productos = await Producto.find(); // Obtener todos los productos desde la base de datos
        res.render('gestionar/index', { productos,  usuario: res.locals.usuario || { nombre: '' } }); // Renderizar la vista 'productos/index' con los productos obtenidos
    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).send('Error al obtener productos');
    }
});



// Middleware para verificar si el usuario es administrador
function verificarAdmin(req, res, next) {
    if (res.locals.usuario && res.locals.usuario.esAdmin) {
        return next(); // Usuario es administrador, permitir acceso
    } else {
        return res.status(403).send('Acceso prohibido. Debes ser administrador para acceder a esta página.');
    }
}

// Ruta para la página de administraciónn
app.get('/administrar', verificarAdmin, async (req, res) => {
    try {
        const productos = await Producto.find(); // Obtener todos los productos desde la base de datos
        res.render('admin/index', { productos, usuario: res.locals.usuario || { nombre: '' } });
    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).send('Error al obtener productos');
    }
});

app.get('/clientes', verificarAdmin, async (req, res) => {
    try {
        const productos = await Producto.find(); // Obtener todos los productos desde la base de datos
        res.render('clientes/index', { productos, usuario: res.locals.usuario }); // Renderizar la vista 'productos/index' con los productos obtenidos
    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).send('Error al obtener productos');
    }
});

app.get('/cuenta', async (req, res) => {
    try {
        const usuario = res.locals.usuario;
        if (!usuario) {
            return res.status(401).send('Usuario no autenticado');
        }
     
        const usuarioId = usuario._id;
        
       
        res.render('cuenta/index', { usuario, usuarioId });
    } catch (err) {
        console.error('Error al obtener usuario para la cuenta:', err);
        res.status(500).send('Error al obtener datos del usuario');
    }
});

app.get('/vercarrito', async (req, res) => {
    try {
        const productosCarrito = req.query.productos;
        
        // Decodificar y parsear los productos del carrito
        const cart = JSON.parse(decodeURIComponent(productosCarrito));
        
      
        const productos = await Producto.find(); // Obtener todos los productos desde la base de datos
        
        // Renderizar la vista 'carrito/index' con los productos, el usuario y los productos en el carrito
        res.render('carrito/index', { productos, usuario: res.locals.usuario || { nombre: '' }, cart });
    } catch (err) {
        console.error('Error al obtener productos:', err);
        res.status(500).send('Error al obtener productos');
    }
});

// Rutas estaticas

app.use('/', express.static(path.resolve(__dirname, 'views', 'home')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/cuenta', express.static(path.resolve(__dirname, 'views', 'cuenta')));
app.use('/vercarrito', express.static(path.resolve(__dirname, 'views', 'carrito')));
app.use('/informacion', express.static(path.resolve(__dirname, 'views', 'infocuenta')));
app.use('/iniciarsesion', express.static(path.resolve(__dirname, 'views', 'iniciar')));
app.use('/tuspedidos', express.static(path.resolve(__dirname, 'views', 'pedidos')));
app.use('/registrarse', express.static(path.resolve(__dirname, 'views', 'registrar')));
app.use('/servicioalcliente', express.static(path.resolve(__dirname, 'views', 'serviciocliente')));
app.use('/clientes', express.static(path.resolve(__dirname, 'views', 'clientes')));
app.use('/gestion', express.static(path.resolve(__dirname, 'views', 'gestionar')));
app.use('/administrar', express.static(path.resolve(__dirname, 'views', 'admin')));
app.use('/verproductos', express.static(path.resolve(__dirname, 'views', 'productos')));
app.use("/main",express.static(__dirname + '/main'));

// Rutas de Controllers

app.use(cotizacionesRouter);
app.use('/usuarios', userRouter); 
app.use('/api', productosRouter); 
app.use('/sesion', iniciarSesion);
app.use('/subir', subirProducto);
app.use('/fav', favoritoRouter);

app.post('/proseguircompra', async (req, res) => {
    const { usuario, productos } = req.body;

    try {
        // Buscar el usuario por nombre
        const usuarioDetalles = await Usuario.findOne({ nombre: usuario });

        if (!usuarioDetalles) {
            throw new Error('Usuario no encontrado');
        }

        // Crear una nueva cotización
        const nuevaCotizacion = new Cotizacion({
            usuario: usuarioDetalles._id,
            usuarioNombre: usuarioDetalles.nombre, 
            productos
        });

        // Guardar en la base de datos
        const cotizacionGuardada = await nuevaCotizacion.save();

        // Enviar correo con los detalles de la cotización
        await enviarCorreoCotizacion({
            usuarioId: usuarioDetalles._id, 
            productos
        });

        // Enviar respuesta al cliente
        res.status(201).json(cotizacionGuardada);
    } catch (error) {
        console.error('Error al guardar la cotización:', error);
        res.status(500).json({ error: 'Error al guardar la cotización' });
    }
});

app.get('/tuspedidos', async (req, res) => {
    try {
        const usuarioNombre = req.cookies.usuario;

        // Consultar el usuario por su nombre
        const usuarioDetalles = await Usuario.findOne({ nombre: usuarioNombre });

        if (!usuarioDetalles) {
            throw new Error('Usuario no encontrado');
        }

        // Consultar las cotizaciones del usuario
        const cotizaciones = await Cotizacion.find({ usuario: usuarioDetalles._id }).sort({ fecha: -1 });

        // Renderizar la vista 'pedidos/index' con las cotizaciones
        res.render('pedidos/index', { cotizaciones, usuario: usuarioDetalles });
    } catch (error) {
        console.error('Error al obtener los pedidos:', error);
        res.status(500).send('Error al obtener los pedidos del usuario');
    }
});

app.get('/informacion', (req, res) => {
   
        res.render('infocuenta/index', { usuario: res.locals.usuario });
});

// Ruta para cerrar sesión
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error al cerrar sesión:', err);
            return res.status(500).json({ error: 'Error al cerrar sesión' });
        }
     
        res.clearCookie('usuario'); // Borra la cookie 'usuario'
        res.redirect('/'); 
    });
});


app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).send('Error interno del servidor');
});

// Iniciar el servidor
app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
module.exports = app;