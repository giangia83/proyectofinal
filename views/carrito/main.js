document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.myCard');

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

    const cotizacionForm = document.getElementById('cotizacionForm');
    if (cotizacionForm) {
        cotizacionForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(cotizacionForm);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            // Agregar usuario a los datos a enviar
            data.usuario = usuario;

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
                } else {
                    console.error('Error al guardar la cotización:', response.statusText);
                    // Mostrar mensaje de error al usuario
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
                // Mostrar mensaje de error al usuario
            }
        });
    }

  
});
