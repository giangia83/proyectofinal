// Importar fetch para realizar peticiones HTTP
async function cargarUsuarios() {
    try {
        // Realizar la petición GET a la API de usuarios
        const response = await fetch('/usuarios');
        const users = await response.json();

        if (!response.ok) {
            throw new Error(users.message || 'Error al cargar usuarios');
        }

        return users; // Devuelve la lista de usuarios cargados
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
        throw error;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    let usuarios;
    try {
        usuarios = await cargarUsuarios();
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
        alert('Error al cargar usuarios. Por favor, inténtalo de nuevo más tarde.');
        return;
    }

    const formL = document.querySelector('#login-form');
    const loginInput = document.querySelector('#inputEmail');
    const passwordInput = document.querySelector('#inputPassword');

    formL.addEventListener('submit', async e => {
        e.preventDefault();

        const correo = loginInput.value;
        const password = passwordInput.value;

        try {
            const usuario = usuarios.find(user => user.correo === correo);

            if (usuario) {
                const response = await fetch('/sesion/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        correo: correo,
                        contraseña: password
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Error al iniciar sesión');
                }

                // Redirigir según el valor de redirectTo
                if (data.redirectTo) {
                    window.location.href = data.redirectTo;
                }
            } else {
                mostrarMensaje('Usuario no encontrado. Por favor, inténtalo de nuevo.');
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            mostrarMensaje('Error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.');
        }
    });

    function mostrarMensaje(mensaje) {
        alert(mensaje);
    }
});


// Función para obtener el valor de una cookie por nombre
function getCookie(nombre) {
    const cookieValue = document.cookie.match('(^|;)\\s*' + nombre + '\\s*=\\s*([^;]+)');
    return cookieValue ? cookieValue.pop() : null;
}
