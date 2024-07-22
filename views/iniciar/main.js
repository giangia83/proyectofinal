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
    // Cargar los usuarios al cargar la página

    const usuarioCookie = getCookie('usuario');

    if (usuarioCookie) {
        // Si hay una cookie de usuario, redirigir directamente a la página de cuenta
        window.location.href = '/';
        return; // Termina la ejecución para evitar que siga procesando el código
    } else {
        // Si no hay cookie de usuario, mostrar la página de inicio de sesión
        console.log('No hay cookie de usuario. Mostrar página de inicio de sesión.');
    }

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

        const adminEmail = 'jbiadarola@hotmail.com';
        const adminPassword = 'starclean123';
        const correo = loginInput.value;
        const password = passwordInput.value;

        try {
            // Buscar el usuario por correo electrónico en la lista cargada
            const usuario = usuarios.find(user => user.correo === correo);

            if (usuario) {
                if (usuario.contraseña === adminPassword && correo === adminEmail) {
                    // Guardar la sesión del usuario utilizando cookies
                    document.cookie = `usuario=${usuario.nombre}; path=/`;
                    // Redirigir al usuario a la página de administrador
                    window.location.href = '/administrar';
                } else if (usuario.contraseña === password) {
                    // Guardar la sesión del usuario utilizando cookies
                    document.cookie = `usuario=${usuario.nombre}; path=/`;
                    // Redirigir al usuario a la página de cuenta
                    window.location.href = '/cuenta';
                } else {
                    // Mostrar mensaje de error si las credenciales son inválidas
                    mostrarMensaje('Credenciales inválidas. Por favor, inténtalo de nuevo.');
                }
            } else {
                // Mostrar mensaje de error si no se encontró al usuario
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
function getCookie(usuario) {
    const cookieValue = document.cookie.match('(^|;)\\s*' + usuario + '\\s*=\\s*([^;]+)');
    return cookieValue ? cookieValue.pop() : null;
}

