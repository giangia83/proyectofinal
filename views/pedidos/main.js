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
