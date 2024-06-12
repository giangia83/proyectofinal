// Importa el modelo de usuario
const Usuario = require('../models/usuario');

// Crear Selectores
const formC = document.querySelector('#form-create');
const formL = document.querySelector('#form-login');
const loginInput = document.querySelector('#login-input');
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

    // Validar si el campo de nombre está vacío
    if (!loginInput.value) {
        noti.textContent = 'El campo no puede estar vacío';
        noti.classList.add('show-notification');
        setTimeout(() => {
            noti.classList.remove('show-notification');
        }, 2000);
        return; // Detener la ejecución del resto del código si el campo está vacío
    }

    try {
        // Consultar si el usuario existe en la base de datos
        const existeUsuario = await Usuario.findOne({ nombre: loginInput.value });

        if (!existeUsuario) {
            noti.innerHTML = 'El Usuario no existe';
            noti.classList.add('show-notification');
            setTimeout(() => {
                noti.classList.remove('show-notification');
            }, 2000);
        } else {
            // Si el usuario existe, redirigir a la página de cuenta
            localStorage.setItem('usuario', JSON.stringify(existeUsuario));
            window.location.href = '/iniciarsesion/';
        }
    } catch (error) {
        console.error('Error al buscar usuario:', error);
        // Manejar el error de acuerdo a tus necesidades
    }
});
