const express = require('express');
const axios = require('axios');
const router = express.Router();
const Cotizacion = require('../models/cotizacion');
const { enviarCorreoPagoConfirmadoAdmin } = require('../controllers/email');
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
    console.log('Recibiendo solicitud de pago');
    
    const { orderID, cotizacionId } = req.body; 
    console.log(`orderID: ${orderID}, cotizacionId: ${cotizacionId}`);

    // Validar la entrada
    if (!orderID || !cotizacionId) {
        console.log('Faltan datos en la solicitud');
        return res.status(400).json({ error: 'El ID de la orden y el ID de la cotización son obligatorios.' });
    }
    
    try {
        // Capturar el pago
        const { data: detallesPago } = await axios.post(`https://api.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`, {}, {
            auth: {
                username: process.env.PAYPAL_CLIENT_ID,
                password: process.env.PAYPAL_SECRET
            }
        });

        console.log('Pago capturado:', detallesPago);

        // Obtener la cotización
        const cotizacion = await Cotizacion.findById(cotizacionId);
        if (!cotizacion) {
            return res.status(404).json({ error: 'Cotización no encontrada' });
        }

        // Actualizar el estado de la cotización y detalles de pago
        cotizacion.estado = 'Pagado con PayPal. Esperando confirmación.';
        cotizacion.detallesPago = {
            monto: detallesPago.purchase_units[0].payments.captures[0].amount.value,
            numeroCuenta: 'PayPal',
            fechaPago: new Date(fechaPago),
          
         
        };

        await cotizacion.save();
        await enviarCorreoPagoConfirmadoAdmin(cotizacion);

        // Devolver la respuesta
        res.status(200).json({
            message: 'Pago completado con éxito',
            id: detallesPago.id
        });
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
