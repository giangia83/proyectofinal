async function mostrarInfoPago(banco) {
    const bancoNombre = document.getElementById('bancoNombre');
    const bancoInfo = document.getElementById('bancoInfo');
    const adminDireccion = document.getElementById('adminDireccion');
    const adminTelefono = document.getElementById('adminTelefono');

    let nombre, info;

    switch (banco) {
        case 'bancoVenezuela':
            nombre = 'Banco de Venezuela';
            info = 'Número de cuenta: 0102-0123-4567-8901, Pago móvil: 0412-1234567';
            break;
        case 'banesco':
            nombre = 'Banesco';
            info = 'Número de cuenta: 0134-5678-9012-3456, Pago móvil: 0414-7654321';
            break;
        case 'bancaribe':
            nombre = 'Bancaribe';
            info = 'Número de cuenta: 0115-6789-0123-4567, Pago móvil: 0416-9876543';
            break;
        case 'otroBanco':
            nombre = 'Efectivo';
            info = 'Acordar con Starclean C.A. Puede pagar en el local, contactenos al número de telefono.';
            break;
        default:
            nombre = 'Banco';
            info = 'Información no disponible';
            break;
    }

    bancoNombre.textContent = nombre;
    bancoInfo.textContent = info;

    // Obtener información del admin
    try {
        const response = await fetch('/admin');
        const admin = await response.json();
        if (admin) {
            adminDireccion.textContent = `Dirección: ${admin.direccion}`;
            adminTelefono.textContent = `Teléfono: ${admin.number}`;
        }
    } catch (error) {
        console.error('Error al obtener información del admin:', error);
    }

    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById('modalPago'));
    modal.show();
}
