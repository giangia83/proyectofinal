const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario');

// Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
    try {
        const users = await Usuario.find(); // Busca todos los usuarios en la base de datos

        res.status(200).json(users); // Envía los usuarios encontrados como respuesta
    } catch (error) {
        console.error('Error al buscar usuarios:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
