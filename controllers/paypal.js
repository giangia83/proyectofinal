const express = require('express');
const axios = require('axios');
const router = express.Router();

// Ruta para crear una orden de PayPal
router.post('/create-order', async (req, res) => {
    const { amount } = req.body; // El monto debe enviarse desde el cliente

    try {
        const { data } = await axios.post(`https://api.sandbox.paypal.com/v2/checkout/orders`, {
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'USD', // Ajusta la moneda si es necesario
                    value: amount, // Monto del producto
                }
            }]
        }, {
            auth: {
                username: process.env.PAYPAL_CLIENT_ID,
                password: process.env.PAYPAL_SECRET
            }
        });

        // Devolver el ID de la orden
        res.json({ orderID: data.id });
    } catch (error) {
        console.error('Error al crear la orden:', error);
        if (error.response) {
            res.status(error.response.status).json({ error: error.response.data.message || 'Error al crear la orden.' });
        } else {
            res.status(500).json({ error: 'Error en el servidor.' });
        }
    }
});

// Ruta para capturar el pago
router.post('/payment', async (req, res) => {
    const orderID = req.body.orderID;

    try {
        const { data } = await axios.post(`https://api.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`, {}, {
            auth: {
                username: process.env.PAYPAL_CLIENT_ID,
                password: process.env.PAYPAL_SECRET
            }
        });

        // Procesar los detalles del pago
        res.json(data);
    } catch (error) {
        console.error('Error al capturar el pago:', error);
        if (error.response) {
            const errorCode = error.response.data.name;

            switch (errorCode) {
                case 'ORDER_ALREADY_CAPTURED':
                    return res.status(400).json({ error: 'El pago ya ha sido capturado.' });
                case 'ORDER_NOT_APPROVED':
                    return res.status(400).json({ error: 'La orden no ha sido aprobada.' });
                case 'UNPROCESSABLE_ENTITY':
                    return res.status(422).json({ error: 'La acción solicitada no se pudo realizar, semánticamente incorrecta o falló la validación empresarial.' });
                default:
                    return res.status(error.response.status).json({ error: error.response.data.message || 'Error al capturar el pago.' });
            }
        }
        res.status(500).json({ error: 'Error en el servidor.' });
    }
});

// Exportar el router
module.exports = router;
