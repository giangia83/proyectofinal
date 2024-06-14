const formL = document.querySelector('#login-form');
const loginInput = document.querySelector('#inputEmail');
const passwordInput = document.querySelector('#inputPassword');

formL.addEventListener('submit', async e => {
    e.preventDefault();

    // Consulta a la base de datos para encontrar al usuario por su correo electrónico
    try {
        const usuario = await buscarUsuarioPorEmail(loginInput.value);

        if (!usuario) {
            // El usuario no existe en la base de datos
            mostrarMensaje('El usuario no existe');
            return;
        }

        // Verificar si la contraseña coincide
        if (usuario.contraseña !== passwordInput.value) {
            // La contraseña no coincide
            mostrarMensaje('Contraseña incorrecta');
            return;
        }

        // La autenticación fue exitosa
        // Redirigir al usuario a la página de cuenta
        window.location.href = '/cuenta';
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        mostrarMensaje('Error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.');
    }
});

async function buscarUsuarioPorEmail(email) {
    // Realizar una solicitud al servidor para buscar al usuario por su correo electrónico
    const url = `/api/users?correo=${encodeURIComponent(email)}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Error al buscar usuario');
    }

    const data = await response.json();
    return data.usuario; // Suponiendo que el servidor devuelve un objeto con el usuario encontrado
}

function mostrarMensaje(mensaje) {
    // Aquí mostrarías el mensaje de error en tu interfaz de usuario
    alert(mensaje);
}
