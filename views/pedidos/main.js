document.addEventListener('DOMContentLoaded', function() {
    // Función para manejar el cambio en el método de pago
    document.querySelectorAll('select[name="metodoPago"]').forEach(function(selectElement, index) {
        selectElement.addEventListener('change', function() {
            const isEfectivo = this.value === 'Efectivo';
            const cuentaField = document.getElementById(`cuenta${index}`);
            const telefonoField = document.getElementById(`telefono${index}`);
            const numeroTransaccionField = document.getElementById(`numeroTransaccion${index}`);

            // Desactivar o activar campos según la opción seleccionada
            cuentaField.disabled = isEfectivo;
            telefonoField.disabled = isEfectivo;
            numeroTransaccionField.disabled = isEfectivo;
        });
    });

    // Función para manejar el envío del formulario de pago
    document.querySelectorAll('form[data-cotizacion-id]').forEach(function(formElement) {
        formElement.addEventListener('submit', function(event) {
            event.preventDefault();
            const cotizacionId = this.getAttribute('data-cotizacion-id');
            submitPago(event, cotizacionId);
        });
    });

    // Función para enviar el pago al servidor
    function submitPago(event, cotizacionId) {
        // Captura los datos del formulario
        const formData = new FormData(event.target);
        
        // Convierte el FormData a un objeto
        const data = Object.fromEntries(formData.entries());
    
        // Realiza la petición POST al servidor
        fetch(`/vercotizaciones/pagar/${cotizacionId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.message === 'Pago verificado y correo enviado al admin') {
                // Muestra un pop-up o modal de confirmación
                alert('El pago ha sido verificado y el correo ha sido enviado exitosamente');
            } else {
                alert('Error en la verificación del pago.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ocurrió un error al procesar el pago.');
        });
    }

    // Inicializa los botones de PayPal
    initPaypalButtons();
});
function initPaypalButtons() {
    document.querySelectorAll('[id^="paypal-button-container"]').forEach((container) => {
        const cotizacionId = container.getAttribute('data-cotizacion-id'); // Obtener el ID de la cotización

        paypal.Buttons({
            createOrder: function(data, actions) {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: '100.00'  // Ajusta con el monto dinámico de tu producto
                        }
                    }]
                });
            },
            onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                    return fetch(`/vercotizaciones/paypal/payment/${cotizacionId}`, {  // Usar el ID aquí
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            orderID: data.orderID  // El ID de la orden de PayPal
                        })
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Error en la respuesta del servidor');
                        }
                        return response.json();
                    })
                    .then(data => {
                        alert('Pago completado. ID de la transacción: ' + data.id);
                    })
                    .catch(error => {
                        console.error('Error al completar el pago:', error);
                        alert('Ocurrió un error durante el pago con PayPal.');
                    });
                });
            }
        }).render(`#paypal-button-container${container.getAttribute('id').match(/\d+/)[0]}`);
    });
}
