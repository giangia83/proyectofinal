// main.js

async function cargarUsuarios() {
    try {
        // Realizar la petición GET a la API de usuarios
        const response = await fetch('/api/users');
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

// Función para iniciar sesión en el servidor
async function iniciarSesion(correo, contraseña) {
    try {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ correo, contraseña })
        });

        const data = await response.json();

        if (response.ok) {
            return data.usuario; // Devolver el usuario si el inicio de sesión fue exitoso
        } else {
            throw new Error(data.error || 'Error al iniciar sesión');
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        throw error;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    // Cargar los usuarios al cargar la página (opcional)
    let usuarios;
    try {
        usuarios = await cargarUsuarios();
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
        alert('Error al cargar usuarios. Por favor, inténtalo de nuevo más tarde.');
        return;
    }

    // Obtener el formulario de inicio de sesión y los campos de correo y contraseña
    const formL = document.querySelector('#login-form');
    const loginInput = document.querySelector('#inputEmail');
    const passwordInput = document.querySelector('#inputPassword');

    formL.addEventListener('submit', async e => {
        e.preventDefault();

        const correo = loginInput.value;
        const contraseña = passwordInput.value;

        try {
            // Buscar el usuario por correo electrónico en la lista cargada
            const usuario = await iniciarSesion(correo, contraseña);

            if (usuario) {
                // El inicio de sesión fue exitoso, redirigir al usuario a la página de cuenta
                window.location.href = '/cuenta';
            } else {
                // Mostrar un mensaje de error si el inicio de sesión falla
                mostrarMensaje('Credenciales inválidas. Por favor, inténtalo de nuevo.');
            }
        } catch (error) {
            // Mostrar un mensaje de error si hay algún problema durante el proceso de inicio de sesión
            console.error('Error al iniciar sesión:', error);
            mostrarMensaje('Error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.');
        }
    });

    function mostrarMensaje(mensaje) {
        alert(mensaje);
    }
});
