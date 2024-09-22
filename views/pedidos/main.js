 document.querySelectorAll('select[name="metodoPago"]').forEach(function(selectElement, index) {
        selectElement.addEventListener('change', function() {
            const isEfectivo = this.value === 'Efectivo';
            const cuentaField = document.getElementById('cuenta' + index);
            const telefonoField = document.getElementById('telefono' + index);
            const numeroTransaccionField = document.getElementById('numeroTransaccion' + index);

            // Desactivar o activar campos según la opción seleccionada
            cuentaField.disabled = isEfectivo;
            telefonoField.disabled = isEfectivo;
            numeroTransaccionField.disabled = isEfectivo;
        });
    });

    function submitPago(event, cotizacionId) {
        event.preventDefault(); // Evita el comportamiento predeterminado de enviar el formulario
    
        // Captura los datos del formulario
        const formData = new FormData(event.target);
    
        // Convierte el FormData a un objeto
        const data = {};
        formData.forEach((value, key) => data[key] = value);
    
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
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    
