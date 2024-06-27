const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const userRouter = require('./controllers/usuarios');

const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 3001;

app.use(cookieParser());

// Middleware para manejar sesiones
app.use(session({
    secret: 'Hk^6(0p3Q{=r#Lm$gU', // Secreto utilizado para firmar la cookie de sesión
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true, // Debería ser true en producción con HTTPS
        httpOnly: true, // La cookie solo es accesible desde el servidor
        maxAge: 24 * 60 * 60 * 1000 // Tiempo de expiración de la sesión en milisegundos (1 día)
    }
}));

// Ruta para manejar la sesión de usuario
app.get('/cuenta', (req, res) => {
    // Verificar si el usuario está autenticado
    if (req.cookies.usuario) {
        res.send(`Bienvenido, ${req.cookies.usuario}!`);
    } else {
        res.redirect('/iniciarsesion'); // Redirigir a la página de inicio de sesión si no hay sesión activa
    }
});

// Conexión a la base de datos
try {
    mongoose.connect('mongodb+srv://giangia83:gian2005@starclean.krrul4s.mongodb.net/?retryWrites=true&w=majority&appName=starclean', {
       
    });
    console.log('Conexión a la base de datos establecida');
} catch (error) {
    console.error('Error al conectar a la base de datos:', error);
}

app.use('/views', express.static(path.join(__dirname, 'views')));

// Rutas de frontend - Servir archivos estáticos
app.use('/', express.static(path.resolve(__dirname, 'views', 'iniciar')));
app.use('/cuenta', express.static(path.resolve(__dirname, 'views', 'cuenta')));
app.use('/informacion', express.static(path.resolve(__dirname, 'views', 'infocuenta')));
app.use('/iniciarsesion', express.static(path.resolve(__dirname, 'views', 'iniciar')));
app.use('/tuspedidos', express.static(path.resolve(__dirname, 'views', 'pedidos')));
app.use('/registrarse', express.static(path.resolve(__dirname, 'views', 'registrar')));
app.use('/configuracion', express.static(path.resolve(__dirname, 'views', 'plantila-configuracion')));
app.use('/servicioalcliente', express.static(path.resolve(__dirname, 'views', 'serviciocliente')));
app.use('/clientes', express.static(path.resolve(__dirname, 'views', 'clientes')));


// Middleware para procesar JSON
app.use(express.json());

// Rutas de backend
app.use('/api/users', userRouter);


app.post('/api/login', async (req, res) => {
    // Aquí puedes manejar la lógica de inicio de sesión si es necesario
    res.status(501).json({ error: 'Ruta de inicio de sesión no implementada' });
});






// Iniciar el servidor
app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
