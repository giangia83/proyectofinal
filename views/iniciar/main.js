// main.js

const formL = document.querySelector('#login-form');
const loginInput = document.querySelector('#inputEmail');
const passwordInput = document.querySelector('#inputPassword');

// Agregar un evento de escucha para el envío del formulario de inicio de sesión
formL.addEventListener('submit', async e => {
    e.preventDefault();

    // Extraer los valores de los campos de correo electrónico y contraseña
    const email = loginInput.value;
    const password = passwordInput.value;

    // Intentar iniciar sesión con los datos proporcionados
    try {
        // Llamar al controlador para iniciar sesión
        const usuario = await iniciarSesion(email, password);

        // Verificar si se encontró un usuario
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

// Función para mostrar un mensaje en la interfaz de usuario
function mostrarMensaje(mensaje) {
    alert(mensaje);
}
