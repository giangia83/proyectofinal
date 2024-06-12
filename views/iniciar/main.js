const Usuario = require('../models/usuario');

// Crear Selectores
const formC = document.querySelector('#form-create');
const formL = document.querySelector('#login-form'); // Cambiado el identificador a "login-form"
const loginInput = document.querySelector('#inputEmail'); // Cambiado el id a "inputEmail"
const passwordInput = document.querySelector('#inputPassword'); // Cambiado el id a "inputPassword"
const createInput = document.querySelector('#create-input');
const noti = document.querySelector('.notification');

formC.addEventListener('submit', async e => {
    e.preventDefault();

    // Validar si el campo de nombre está vacío
    if (!createInput.value) {
        noti.textContent = 'El campo no puede estar vacío';
        noti.classList.add('show-notification');
        setTimeout(() => {
            noti.classList.remove('show-notification');
        }, 2000);
        return; // Detener la ejecución del resto del código si el campo está vacío
    }

    try {
        // Consultar si el usuario ya existe en la base de datos
        const existeUsuario = await Usuario.findOne({ nombre: createInput.value });

        if (existeUsuario) {
            noti.textContent = 'El usuario ya existe';
            noti.classList.add('show-notification');
            setTimeout(() => {
                noti.classList.remove('show-notification');
            }, 2000);
        } else {
            // Si el usuario no existe, crear un nuevo usuario
            await Usuario.create({ nombre: createInput.value });
            noti.innerHTML = `El usuario ${createInput.value} se ha registrado satisfactoriamente`;
            noti.classList.add('show-notification');
            setTimeout(() => {
                noti.classList.remove('show-notification');
            }, 2000);
        }

        createInput.value = ''; // Limpiar el campo de entrada
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        // Manejar el error de acuerdo a tus necesidades
    }
});

formL.addEventListener('submit', async e => {
    e.preventDefault();

    // Validar si el campo de nombre o contraseña está vacío
    if (!loginInput.value || !passwordInput.value) {
        noti.textContent = 'El campo de correo o contraseña no puede estar vacío';
        noti.classList.add('show-notification');
        setTimeout(() => {
            noti.classList.remove('show-notification');
        }, 2000);
        return; // Detener la ejecución del resto del código si el campo está vacío
    }

    try {
        // Consultar si el usuario existe en la base de datos
        const existeUsuario = await Usuario.findOne({ nombre: loginInput.value });

        if (!existeUsuario || existeUsuario.contraseña !== passwordInput.value) {
            noti.innerHTML = 'Correo o contraseña incorrectos';
            noti.classList.add('show-notification');
            setTimeout(() => {
                noti.classList.remove('show-notification');
            }, 2000);
        } else {
            // Si el usuario existe y la contraseña es correcta, redirigir a la página de home (/home)
            localStorage.setItem('usuario', JSON.stringify(existeUsuario));
            window.location.href = '/home'; // Cambio de la URL de redirección
        }
    } catch (error) {
        console.error('Error al buscar usuario:', error);
        // Manejar el error de acuerdo a tus necesidades
    }
});
