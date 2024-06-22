// usersSearchId.js
const express = require('express');
const router = express.Router();
// controllers/usuarios.js

const User = require('../models/User'); // Importa el modelo de usuario

// Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find(); // Busca todos los usuarios en la base de datos

        res.status(200).json(users); // Envía los usuarios encontrados como respuesta
    } catch (error) {
        console.error('Error al buscar usuarios:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

