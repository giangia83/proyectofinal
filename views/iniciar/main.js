

// Crear Selectores
const formC = document.querySelector('#form-create');
const formL = document.querySelector('#login-form'); // Cambiado el identificador a "login-form"
const noti = document.querySelector('.notification');

formC.addEventListener('submit', async e => {
    e.preventDefault();

    const createInput = document.querySelector('#create-input'); // Mover aquí para evitar búsquedas repetidas

    // Validar si el campo de nombre está vacío
    if (!createInput.value) {
        showNotification('El campo no puede estar vacío');
        return; // Detener la ejecución del resto del código si el campo está vacío
    }

    try {
        // Consultar si el usuario ya existe en la base de datos
        const existeUsuario = await Usuario.findOne({ nombre: createInput.value });

        if (existeUsuario) {
            showNotification('El usuario ya existe');
        } else {
            // Si el usuario no existe, crear un nuevo usuario
            await Usuario.create({ nombre: createInput.value });
            showNotification(`El usuario ${createInput.value} se ha registrado satisfactoriamente`);
        }

        createInput.value = ''; // Limpiar el campo de entrada
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        showNotification('Error al registrar usuario. Por favor, inténtalo de nuevo más tarde.');
    }
});

formL.addEventListener('submit', async e => {
    e.preventDefault();

    const loginInput = document.querySelector('#inputEmail'); // Mover aquí para evitar búsquedas repetidas
    const passwordInput = document.querySelector('#inputPassword'); // Mover aquí para evitar búsquedas repetidas

    // Validar si el campo de nombre o contraseña está vacío
    if (!loginInput.value || !passwordInput.value) {
        showNotification('El campo de correo o contraseña no puede estar vacío');
        return; // Detener la ejecución del resto del código si el campo está vacío
    }

    try {
        // Consultar si el usuario existe en la base de datos
        const existeUsuario = await Usuario.findOne({ nombre: loginInput.value });

        if (!existeUsuario || existeUsuario.contraseña !== passwordInput.value) {
            showNotification('Correo o contraseña incorrectos');
        } else {
            // Si el usuario existe y la contraseña es correcta, redirigir a la página de home (/home)
            localStorage.setItem('usuario', JSON.stringify(existeUsuario));
            window.location.href = '/cuenta'; // Cambio de la URL de redirección
        }
    } catch (error) {
        console.error('Error al buscar usuario:', error);
        showNotification('Error al buscar usuario. Por favor, inténtalo de nuevo más tarde.');
    }
});

function showNotification(message) {
    noti.textContent = message;
    noti.classList.add('show-notification');
    setTimeout(() => {
        noti.classList.remove('show-notification');
    }, 2000);
}
console.log("script working");