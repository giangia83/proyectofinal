const express = require('express');
const router = express.Router();
const Cotizacion = require('../models/cotizacion');
const Producto = require('../models/producto');
const PDFDocument = require('pdfkit');
const transporter = require('../controllers/nodemailer'); // Configuración de Nodemailer
const { enviarCorreoPagoConfirmadoAdmin } = require('../controllers/email');
const paypalClient = require('../controllers/paypal');
const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');



router.get('/vercotizaciones', async (req, res) => {
    try {
       
        const productos = await Producto.find();
        const cotizaciones = await Cotizacion.find()
            .populate('usuario')
            .populate('productos.productoId');

        // Verifica los datos antes de renderizar
        console.log('Cotizaciones:', cotizaciones);

        // Renderiza la vista con los datos obtenidos
        res.render('cotizaciones/index', {
            productos,
            cotizaciones
        });
    } catch (error) {
        console.error('Error al obtener cotizaciones:', error);
        res.status(500).send('Error interno al obtener cotizaciones');
    }
});



// Ruta para obtener detalles de una cotización específica
router.get('/vercotizaciones/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const cotizacion = await Cotizacion.findById(id)
        .populate('productos')
        .populate('usuario', 'nombre'); 
        if (!cotizacion) {
            return res.status(404).json({ message: 'Cotización no encontrada' });
        }
        res.json(cotizacion);
    } catch (error) {
        console.error('Error al obtener cotización:', error);
        res.status(500).json({ message: 'Error interno al obtener cotización' });
    }
});

// Ruta para eliminar una cotización
router.post('/vercotizaciones/eliminar/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const cotizacion = await Cotizacion.findById(id);
        if (!cotizacion) {
            return res.status(404).json({ message: 'Cotización no encontrada' });
        }

        await Cotizacion.findByIdAndDelete(id);
        res.redirect('/vercotizaciones'); 
    } catch (error) {
        console.error('Error al eliminar la cotización:', error);
        res.status(500).json({ message: 'Error interno al eliminar la cotización' });
    }
});

router.get('/vercotizaciones/detalles/:id', async (req, res) => {
    try {
        const cotizacion = await Cotizacion.findById(req.params.id).populate('productos.productoId');
        if (!cotizacion) {
            return res.status(404).json({ message: 'Cotización no encontrada' });
        }
        res.json(cotizacion);
    } catch (error) {
        console.error('Error al obtener cotización:', error);
        res.status(500).json({ message: 'Error al obtener cotización' });
    }
});


// Ruta para actualizar los precios de los productos en una cotización
router.post('/vercotizaciones/actualizar/:id', async (req, res) => {
    const { id } = req.params;
    const { precios } = req.body;

    if (!Array.isArray(precios)) {
        return res.status(400).json({ message: 'Formato de datos incorrecto' });
    }

    try {
        const cotizacion = await Cotizacion.findById(id);
        if (!cotizacion) {
            return res.status(404).json({ message: 'Cotización no encontrada' });
        }

        let preciosActualizados = false;

        // Actualizar los precios de los productos en la cotización
        precios.forEach(({ productoId, precio }) => {
            if (isNaN(precio) || precio < 0) {
                return res.status(400).json({ message: 'Precio inválido' });
            }

            const producto = cotizacion.productos.find(p => p.productoId.toString() === productoId);
            if (producto) {
                producto.precio = precio; // Actualizar el precio del producto
                preciosActualizados = true;
            }
        });

        if (preciosActualizados) {
            await cotizacion.save();
            res.json({ message: 'Cotización actualizada correctamente', cotizacion });
        } else {
            res.status(400).json({ message: 'No se encontraron productos para actualizar' });
        }
    } catch (error) {
        console.error('Error al actualizar la cotización:', error);
        res.status(500).json({ message: 'Error interno al actualizar la cotización' });
    }
});

// Ruta para generar un PDF de la cotización
router.get('/vercotizaciones/pdf/:id', async (req, res) => {
    const { id } = req.params;

    try {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send('ID de cotización inválido');
        }

        const cotizacion = await Cotizacion.findById(id).populate('usuario');
        if (!cotizacion) {
            return res.status(404).send('Cotización no encontrada');
        }

        const doc = new PDFDocument({ margin: 50 });
        let filename = `cotizacion_${id}.pdf`;
        filename = encodeURI(filename);

        res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-type', 'application/pdf');

        // Generar el contenido del PDF
        doc.fontSize(20).text('Starclean C.A', { align: 'center', underline: true });
        doc.fontSize(14).text('Cotización', { align: 'center', margin: [0, 10] });
        doc.moveDown();

        doc.fontSize(12).text(`Cliente: ${cotizacion.usuario.nombre}`, { align: 'left' });
        doc.text(`Dirección: ${cotizacion.usuario.direccion}`);
        doc.text(`Correo: ${cotizacion.usuario.correo}`);
        doc.text(`Teléfono: ${cotizacion.usuario.number}`);
        doc.moveDown();

        doc.fontSize(12).text('Productos:', { underline: true });
        doc.moveDown();

        doc.fontSize(10).text('Descripción          | Cantidad | Precio Unitario | Subtotal', { align: 'left' });

        let total = 0;
        cotizacion.productos.forEach((producto) => {
            const subtotal = producto.precio ? producto.precio * producto.cantidad : 0;
            total += subtotal;
            doc.text(
                `${producto.nombre.padEnd(20)} | ${producto.cantidad.toString().padEnd(7)} | ${producto.precio ? producto.precio.toFixed(2) : 'N/A'.padEnd(15)} | ${subtotal.toFixed(2)}`,
                { align: 'left' }
            );
        });

        doc.text('--------------------------------------------------------------', { align: 'left' });
        doc.text(`Total: ${total.toFixed(2)}`, { align: 'right', margin: [0, 10] });

        // Finalizar el documento
        doc.pipe(res);
        doc.end();
    } catch (error) {
        console.error('Error al generar el PDF:', error);
        res.status(500).send('Error interno al generar el PDF');
    }
});






// Ruta para verificar y enviar la cotización por correo al usuari0
router.post('/vercotizaciones/verificar/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const cotizacion = await Cotizacion.findById(id)
        .populate({
            path: 'usuario', // Llenar los datos del usuario
            select: 'nombre correo direccion number' 
        })
        .populate({
            path: 'productos.productoId', // Llenar los datos del producto dentro de productos
            model: 'Producto', // Asegúrate de que 'Producto' es el nombre correcto del modelo
            select: 'nombre precio' // Selecciona los campos necesarios del producto si es necesario
        });
        
/*  */
        if (!cotizacion) {
            return res.status(404).json({ message: 'Cotización no encontrada' });
        }

        // Crear el PDF de la cotización
        const doc = new PDFDocument({ margin: 50 });

        // Generar el contenido del PDF en un buffer
        const chunks = [];
        doc.on('data', chunks.push.bind(chunks));
        doc.on('end', async () => {
            const pdfBuffer = Buffer.concat(chunks);

        
            try {
                await Cotizacion.findByIdAndUpdate(id, { estado: 'Entregada al correo.' });
            } catch (updateError) {
                console.error('Error al actualizar el estado de la cotización:', updateError);
                return res.status(500).json({ message: 'Error al actualizar el estado de la cotización' });
            }

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: cotizacion.usuario.correo,
                subject: 'Cotización Verificada - Starclean C.A',
                html: `
                    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
                        <header style="text-align: center; padding-bottom: 20px;">
                            <h1 style="color: #E53935;">Cotización Verificada</h1>
                            <p style="font-size: 16px; color: #555;">Hola ${cotizacion.usuario.nombre},</p>
                        </header>
                        
                        <section>
                            <p style="font-size: 16px; color: #555;">Adjunto encontrarás la cotización verificada. Aquí están los detalles:</p>
                            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                                <thead>
                                    <tr style="background-color: #E53935; color: #fff;">
                                        <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Descripción</th>
                                        <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Cantidad</th>
                                        <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Precio Unitario</th>
                                        <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${cotizacion.productos.map(producto => {
                                        const precio = producto.productoId ? producto.productoId.precio : 'N/A';
                                        const subtotal = precio !== 'N/A' ? (precio * producto.cantidad).toFixed(2) : 'N/A';
                                        return `
                                            <tr>
                                                <td style="border: 1px solid #ddd; padding: 12px;">${producto.productoId.nombre}</td>
                                                <td style="border: 1px solid #ddd; padding: 12px;">${producto.cantidad}</td>
                                                <td style="border: 1px solid #ddd; padding: 12px;">${precio !== 'N/A' ? precio.toFixed(2) : 'N/A'}</td>
                                                <td style="border: 1px solid #ddd; padding: 12px;">${subtotal}</td>
                                            </tr>
                                        `;
                                    }).join('')}
                                </tbody>
                            </table>
                            
                            <p style="font-size: 16px; color: #555;">El total de la cotización es:$<strong style="color: #E53935;">${cotizacion.productos.reduce((total, producto) => total + (producto.productoId ? producto.productoId.precio * producto.cantidad : 0), 0).toFixed(2)}</strong></p>
                        </section>
            
                        <footer style="text-align: center; padding-top: 20px; border-top: 1px solid #ddd;">
                            <p style="font-size: 16px; color: #555;">Si deseas realizar la compra, entra a nuestra pagina web y elige un metodo de pago bajo la pestaña "Contacto".</p>
                            <p style="font-size: 14px; color: #999;">Saludos cordiales,<br>Starclean C.A - Miranda, Guatire</p>
                        </footer>
                    </div>
                `,
                attachments: [
                    {
                        filename: `cotizacion_${id}.pdf`,
                        content: pdfBuffer
                    }
                ]
            };
            

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error al enviar el correo:', error);
                    return res.status(500).json({ message: 'Error al enviar el correo' });
                }

                res.json({ message: 'Cotización verificada y enviada por correo' });
            });
        });

                        // Generar el contenido del PDF
            doc.fontSize(20).text('Starclean C.A', { align: 'center', underline: true });
            doc.fontSize(14).text('Cotización Verificada', { align: 'center', margin: [0, 10] });
            doc.moveDown();

            doc.fontSize(12).text(`Cliente: ${cotizacion.usuario.nombre}`, { align: 'left' });
            doc.text(`Dirección: ${cotizacion.usuario.direccion}`);
            doc.text(`Correo: ${cotizacion.usuario.correo}`);
            doc.text(`Teléfono: ${cotizacion.usuario.number}`);
            doc.moveDown();

            doc.fontSize(12).text('Productos:', { underline: true });
            doc.moveDown();

            doc.fontSize(10).text('Descripción          | Cantidad | Precio Unitario | Subtotal', { align: 'left' });

            let total = 0;
            cotizacion.productos.forEach((producto) => {
                const precioUnitario = producto.productoId ? producto.productoId.precio : 0;
                const subtotal = precioUnitario * producto.cantidad;
                total += subtotal;
                doc.text(
                    `${producto.productoId.nombre.padEnd(20)} | ${producto.cantidad.toString().padEnd(7)} | ${precioUnitario.toFixed(2).padEnd(15)} | ${subtotal.toFixed(2)}`,
                    { align: 'left' }
                );
            });

            doc.text('--------------------------------------------------------------', { align: 'left' });
            doc.text(`Total: ${total.toFixed(2)}`, { align: 'right', margin: [0, 10] });

            // Finalizar el documento PDF
            doc.end();

    } catch (error) {
        console.error('Error al verificar y enviar la cotización:', error);
        res.status(500).json({ message: 'Error interno al verificar y enviar la cotización' });
    }
});
router.post('/vercotizaciones/pagar/:id', async (req, res) => {
    const cotizacionId = req.params.id;
    const { cuenta, monto, fechaPago } = req.body;

    try {
        // Buscar la cotización por ID
        const cotizacion = await Cotizacion.findById(cotizacionId);
        
        if (!cotizacion) {
            return res.status(404).json({ message: 'Cotización no encontrada' });
        }

        // Actualizar los detalles del pago y el estado de la cotización
        cotizacion.detallesPago = {
            numeroCuenta: cuenta,
            monto: parseFloat(monto), 
            fechaPago: new Date(fechaPago),
           
        };

        // Cambiar el estado a "Esperando confirmación de pago"
        cotizacion.estado = 'Esperando confirmación de pago';

        // Guardar la cotización actualizada
        await cotizacion.save();

        // Enviar correo al admin con los detalles de la cotización
        await enviarCorreoPagoConfirmadoAdmin(cotizacion);

        // Log del envío del correo
        console.log('Correo enviado al administrador exitosamente');

        // Responder al frontend con éxito
        res.status(200).json({ message: 'Pago verificado y correo enviado al admin' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al verificar el pago', error });
    }
});

router.get('/vercotizaciones/detallesPago/:id', async (req, res) => {
    const cotizacionId = req.params.id;

    try {
        // Buscar la cotización por ID
        const cotizacion = await Cotizacion.findById(cotizacionId).select('detallesPago');

        if (!cotizacion) {
            return res.status(404).json({ message: 'Cotización no encontrada' });
        }

        // Responder con los detalles del pago
        res.status(200).json(cotizacion.detallesPago);
        
    } catch (error) {
        console.error('Error al obtener los detalles del pago:', error);
        res.status(500).json({ message: 'Error al obtener los detalles del pago', error });
    }
});


// Ruta para aprobar el pago
router.post('/vercotizaciones/aprobarPago/:id', async (req, res) => {
    const cotizacionId = req.params.id;
    
    try {
      // Actualiza el estado de la cotización a "Pago Realizado"
      await Cotizacion.findByIdAndUpdate(cotizacionId, { estado: 'Pago Realizado' });
      res.status(200).send('Pago aprobado');
    } catch (err) {
      return res.status(500).send(err);
    }
  });
  
  
 // Ruta para rechazar el pago
router.post('/vercotizaciones/rechazarPago/:id', async (req, res) => {
    const cotizacionId = req.params.id;
  
    try {
      // Actualiza el estado de la cotización a "Pago Rechazado"
      await Cotizacion.findByIdAndUpdate(cotizacionId, { estado: 'Pago Rechazado' });
      
      // Responde con éxito
      res.status(200).send('Pago rechazado');
    } catch (error) {
      // Manejo de errores
      res.status(500).send(error);
    }
  });
  



// Configura tu cliente de PayPal
const client = () => {
    return new checkoutNodeJssdk.core.Payer({
        clientId: process.env.PAYPAL_CLIENT_ID,
        clientSecret: process.env.PAYPAL_SECRET,
        environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
    });
};

// Función para procesar el pago de PayPal
const procesarPagoPaypal = async (req, res) => {
    const { orderID } = req.body;

    try {
        // Crear una solicitud para capturar el pago
        const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderID);
        request.requestBody({});

        const response = await client().execute(request);

        if (response.statusCode !== 201) {
            return res.status(400).json({ error: 'No se pudo capturar el pago' });
        }

        const detallesPago = response.result;

        // Obtener el ID de la cotización del cuerpo de la solicitud
        const cotizacionId = req.params.id; // Cambia esto según cómo obtengas el ID
        const cotizacion = await Cotizacion.findById(cotizacionId);

        if (!cotizacion) {
            return res.status(404).json({ error: 'Cotización no encontrada' });
        }

        // Actualizar el estado de la cotización
        cotizacion.estado = 'Pagado';
        cotizacion.pago = {
            monto: detallesPago.purchase_units[0].amount.value,
            metodo: 'PayPal',
            fechaPago: new Date(),
            idTransaccion: detallesPago.id
        };

        await cotizacion.save();

        res.status(200).json({
            message: 'Pago completado con éxito',
            id: detallesPago.id
        });

    } catch (error) {
        console.error('Error procesando el pago de PayPal:', error);
        res.status(500).json({ error: 'Error procesando el pago' });
    }
};

// Ruta para manejar el pago de PayPal
router.post('/vercotizaciones/paypal/payment/:id', procesarPagoPaypal); 

module.exports = router;
