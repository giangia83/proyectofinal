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

        // Fetch la cotización para obtener el monto total
        fetch(`/vercotizaciones/${cotizacionId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener la cotización');
                }
                return response.json();
            })
            .then(cotizacion => {
                const total = parseFloat(cotizacion.total); // Obtener el total calculado de la cotización y convertirlo a número

                // Verifica si el total está disponible y es válido
                if (isNaN(total) || total <= 0) {
                    // Deshabilitar el botón de PayPal y agregar el tooltip
                    const buttonContainer = document.getElementById(`paypal-button-container${container.getAttribute('id').match(/\d+/)[0]}`);
                    buttonContainer.innerHTML = ''; // Limpiar el contenedor
                    const disabledButton = document.createElement('button');
                    disabledButton.textContent = 'Pagar con PayPal';
                    disabledButton.className = 'btn btn-secondary'; // Cambia esto al estilo deseado
                    disabledButton.disabled = true;
                    disabledButton.title = 'Esperando monto de cotización';
                    disabledButton.style.cursor = 'not-allowed'; // Cambia el cursor para indicar que está deshabilitado
                    buttonContainer.appendChild(disabledButton);
                } else {
                    // Configurar PayPal
                    paypal.Buttons({
                        createOrder: function(data, actions) {
                            return fetch('/paypal/create-order', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    amount: {
                                        value: total.toFixed(2), // Utilizar el total calculado
                                        currency: "USD" 
                                    }
                                })
                            })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Error al crear la orden');
                                }
                                return response.json();
                            })
                            .then(data => {
                                return data.orderID;  // Devolver el orderID de la respuesta
                            });
                        },
                        onApprove: function(data, actions) {
                            return fetch(`/paypal/payment`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    orderID: data.orderID,  // El ID de la orden de PayPal
                                    cotizacionId: cotizacionId  // Incluir el ID de la cotización
                                })
                            })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Error en la respuesta del servidor');
                                }
                                return response.json();
                            })
                            .then(data => {
                                // Mostrar el modal de éxito
                                const modal = new bootstrap.Modal(document.getElementById('paymentSuccessModal'));
                                modal.show();
                            })
                            .catch(error => {
                                console.error('Error al completar el pago:', error);
                                alert('Ocurrió un error durante el pago con PayPal.');
                            });
                        }
                    }).render(container); // Renderizar el botón en el contenedor correcto
                }
            })
            .catch(error => {
                console.error('Error al obtener los datos de la cotización:', error);
                alert('Ocurrió un error al obtener el monto de la cotización.');
            });
    });
}
