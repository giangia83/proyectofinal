const express = require('express');
const axios = require('axios');
const router = express.Router();

// Ruta para crear una orden de PayPal
router.post('/create-order', async (req, res) => {
    const { amount } = req.body; // El monto debe enviarse desde el cliente

    // Validar la entrada
    if (!amount) {
        return res.status(400).json({ error: 'El monto es obligatorio.' });
    }

    try {
        const { data } = await axios.post('https://api.sandbox.paypal.com/v2/checkout/orders', {
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

        const status = error.response ? error.response.status : 500;
        const errorMessage = error.response?.data?.message || 'Error al crear la orden.';

        res.status(status).json({ error: errorMessage });
    }
});

// Ruta para capturar el pago
router.post('/payment', async (req, res) => {
    const { orderID } = req.body; // Obtener el ID de la orden del cuerpo de la solicitud

    // Validar la entrada
    if (!orderID) {
        return res.status(400).json({ error: 'El ID de la orden es obligatorio.' });
    }

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
        
        const status = error.response ? error.response.status : 500;
        const errorCode = error.response?.data?.name;
        let errorMessage;

        switch (errorCode) {
            case 'ORDER_ALREADY_CAPTURED':
                errorMessage = 'El pago ya ha sido capturado.';
                break;
            case 'ORDER_NOT_APPROVED':
                errorMessage = 'La orden no ha sido aprobada.';
                break;
            case 'UNPROCESSABLE_ENTITY':
                errorMessage = 'La acción solicitada no se pudo realizar, semánticamente incorrecta o falló la validación empresarial.';
                break;
            default:
                errorMessage = error.response?.data?.message || 'Error al capturar el pago.';
        }

        res.status(status).json({ error: errorMessage });
    }
});

// Exportar el router
module.exports = router;
