// Selecciona el formulario de registro por su ID
const registroForm = document.querySelector('#registro-form');
const axios = require('axios');

// Escucha el evento de envío del formulario
registroForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Previene el comportamiento predeterminado de enviar el formulario

    // Obtiene los valores ingresados por el usuario en el formulario
    const nombre = document.querySelector('#inputNombre').value;
    const correo = document.querySelector('#inputEmail').value;
    const contraseña = document.querySelector('#inputPassword').value;
    const direccion = document.querySelector('#inputDireccion').value;
    const ciudad = document.querySelector('#inputCiudad').value;

    try {
        // Realiza la operación de registro en la base de datos
        const respuesta = await axios.post('/api/users', { // Reemplaza '/usuarios/registro' con la ruta correspondiente a tu API
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre: nombre,
                correo: correo,
                contraseña: contraseña,
                direccion: direccion,
                ciudad: ciudad
            })
        });

        // Verifica si el registro fue exitoso
        if (respuesta.ok) {
            // Guarda el usuario en la base de datos
            async function guardarUsuario() {
                // Realiza la operación de guardar usuario
                const respuestaUsuario = await fetch('/api/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        nombre: nombre
                    })
                });
                
                const usuarioGuardado = await respuestaUsuario.json();
                console.log('Usuario guardado:', usuarioGuardado);
            }
            await guardarUsuario();

            // Redirige a la página de inicio de sesión
            window.location.href = '/iniciarsesion';
        } else {
            // Maneja cualquier error de respuesta del servidor
            console.error('Error al registrar usuario:', respuesta.statusText);
            // Muestra un mensaje de error al usuario
            alert('Error al registrar usuario. Por favor, inténtalo de nuevo más tarde.');
        }
    } catch (error) {
        console.error('Error al procesar el formulario de registro:', error);
        // Maneja el error de acuerdo a tus necesidades, por ejemplo, mostrando un mensaje de error al usuario
        alert('Error al procesar el formulario de registro. Por favor, inténtalo de nuevo más tarde.');
    }
});
