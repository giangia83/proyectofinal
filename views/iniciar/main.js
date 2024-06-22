// main.js


const formL = document.querySelector('#login-form');
const loginInput = document.querySelector('#inputEmail');
const passwordInput = document.querySelector('#inputPassword');

// Agregar un evento de escucha para el envío del formulario de inicio de sesión
formL.addEventListener('submit', async e => {
    e.preventDefault();

    // Extraer los valores de los campos de correo electrónico y contraseña
    const correo = loginInput.value;
    const password = passwordInput.value;

    // Intentar iniciar sesión con los datos proporcionados
    try {
        // Llamar al controlador para iniciar sesión
        const usuario = await iniciarSesion(correo, password);

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

// Función para iniciar sesión utilizando el controlador correspondiente
async function iniciarSesion(correo, password) {
    try {
        // Llamar al controlador para buscar el usuario por correo electrónico
        const usuario = await buscarUsuarioPorCorreo(correo);

        // Verificar si se encontró un usuario y si la contraseña coincide
        if (usuario && usuario.contraseña === password) {
            // Devolver el usuario encontrado si las credenciales son válidas
            return usuario;
        } else {
            // Devolver null si las credenciales son inválidas
            console.log("Invalido")
            return null;
        }
    } catch (error) {
        // Lanzar cualquier error que ocurra durante el proceso
        throw error;
    }
}

// Función para mostrar un mensaje en la interfaz de usuario
function mostrarMensaje(mensaje) {
    alert(mensaje);
}

// Asegurar que la función buscarUsuarioPorCorreo esté definida
async function buscarUsuarioPorCorreo(correo) {
    try {
        // Llamar al controlador correspondiente para buscar el usuario por correo electrónico
        // Debe ser implementada en otro archivo, como usuariosController.js
        // y exportada adecuadamente para que pueda ser importada aquí
    } catch (error) {
        throw error;
    }
}
