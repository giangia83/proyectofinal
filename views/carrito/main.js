document.addEventListener('DOMContentLoaded', () => {
    // Función para obtener el nombre de usuario desde la cookie

    // Obtener el nombre de usuario actual
    const usuario = res.locals.usuario;
    const nombreUsuario = usuario.nombre;
    if (!nombreUsuario) {
        console.error('No se pudo obtener el nombre de usuario desde la cookie.');
        return;
    }

    // Obtener el carrito desde sessionStorage
    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];

    const cotizacionForm = document.getElementById('cotizacionForm');
    if (cotizacionForm) {
        cotizacionForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            // Preparar los datos a enviar
            const data = {
                usuario: nombreUsuario,
                estado: 'Pendiente',
                productos: cart.map(producto => ({
                    id: producto.id,
                    nombre: producto.name, // Aquí usamos 'name' según el HTML proporcionado
                    categoria: producto.category,
                    cantidad: parseInt(document.getElementsByName(`cantidad${producto.id}`)[0].value, 10),
                })),
            };

            try {
                const response = await fetch('/proseguircompra', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    const responseData = await response.json();
                    console.log('Cotización guardada exitosamente:', responseData);
                    // Redirigir o mostrar mensaje de éxito al usuario
                    // Ejemplo de redirección después de guardar la cotización
                    window.location.href = '/'; // Puedes redirigir a una página de éxito
                } else {
                    console.error('Error al guardar la cotización:', response.statusText);
                    // Mostrar mensaje de error al usuario
                    alert('Hubo un problema al enviar la cotización. Por favor, inténtalo nuevamente.');
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
                // Mostrar mensaje de error al usuario
                alert('Hubo un problema al enviar la cotización. Por favor, inténtalo nuevamente.');
            }
        });
    }
});
