const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')
const userRouter = require('./controllers/usuarios')
const port = process.env.PORT || 3001;

//conexion a la bd
try {
    mongoose.connect('mongodb+srv://giangia83:gian2005@starclean.krrul4s.mongodb.net/?retryWrites=true&w=majority&appName=starclean')
    console.log('Lista la conexion BD')
} catch (error){
    console.log(error)
}

//RUTAS DE FRONTEND
app.use('/',express.static(path.resolve('views','home')))
app.use('/cuenta',express.static(path.resolve('views','cuenta')))
app.use('/informacion',express.static(path.resolve('infocuenta')))
app.use('/iniciarsesion',express.static(path.resolve('iniciar')))
app.use('/tuspedidos',express.static(path.resolve('pedidos')))
app.use('/registrarse',express.static(path.resolve('registrar')))
app.use('/configuracion',express.static(path.resolve('plantila-configuracion')))
app.use('/servicioalcliente',express.static(path.resolve('views','serviciocliente')))

//SUPER IMPORTANTE
app.use(express.json())

//RUTAS DE BACKEND
app.use('/api/users',userRouter)

module.exports = app