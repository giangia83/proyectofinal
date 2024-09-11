document.addEventListener('DOMContentLoaded', () => {
    // Función para obtener el nombre de usuario desde la cookie
    function getUsuarioDesdeCookie() {
        const cookies = document.cookie.split(';').map(cookie => cookie.trim());
        for (const cookie of cookies) {
            const parts = cookie.split('=');
            if (parts[0].trim() === 'usuario') {
                return decodeURIComponent(parts[1]);
            }
        }
        return null;
    }

    // Obtener el nombre de usuario actual
    const usuario = getUsuarioDesdeCookie();

    if (!usuario) {
        console.error('No se pudo obtener el nombre de usuario desde la cookie.');
        return;
    }

    
    let cart = JSON.parse(sessionStorage.getItem('cart')) || [];

    // Función para eliminar un producto del carrito
    window.eliminarProducto = function (idProducto) {
        // Filtrar el producto fuera del carrito
        cart = cart.filter(producto => producto.id !== idProducto);

        // Actualizar sessionStorage con el carrito filtrado
        sessionStorage.setItem('cart', JSON.stringify(cart));

        // Eliminar el elemento de la lista en la interfaz
        const productoElement = document.getElementById(`producto-${idProducto}`);
        if (productoElement) {
            productoElement.remove();
        }

        // Si el carrito está vacío después de eliminar, puedes hacer algo más como redirigir
        if (cart.length === 0) {
            alert('El carrito está vacío.');
        }

        // Mostrar un mensaje de confirmación o simplemente recargar la página
        location.reload(); // Recarga la página para actualizar el carrito
    };

    // Enviar cotización
    const cotizacionForm = document.getElementById('cotizacionForm');
    if (cotizacionForm) {
        cotizacionForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            // Preparar los datos a enviar
            const data = {
                usuario: usuario,
                estado: 'Pendiente',
                productos: cart.map(producto => ({
                    id: producto.id,
                    nombre: producto.name,
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
                    window.location.href = '/tuspedidos';
                } else {
                    console.error('Error al guardar la cotización:', response.statusText);
                    alert('Hubo un problema al enviar la cotización. Por favor, inténtalo nuevamente.');
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
                alert('Hubo un problema al enviar la cotización. Por favor, inténtalo nuevamente.');
            }
        });
    }
});
