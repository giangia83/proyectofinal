const registroForm = document.querySelector('#registro-form');

registroForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nombre = document.querySelector('#inputNombre').value;
    const correo = document.querySelector('#inputEmail').value;
    const contraseña = document.querySelector('#inputPassword').value;
    const direccion = document.querySelector('#inputDireccion').value;
    const ciudad = document.querySelector('#inputCiudad').value;

    try {
        const respuesta = await axios.post('/api/users', {
            nombre: nombre,
            correo: correo,
            contraseña: contraseña,
            direccion: direccion,
            ciudad: ciudad
        });

        if (respuesta.status === 201) {
            console.log('Usuario creado exitosamente');
            window.location.href = '/iniciarsesion';
        } else {
            console.error('Error al registrar usuario:', respuesta.statusText);
            alert('Error al registrar usuario. Por favor, inténtalo de nuevo más tarde.');
        }
    } catch (error) {
        console.error('Error al procesar el formulario de registro:', error);
        alert('Error al procesar el formulario de registro. Por favor, inténtalo de nuevo más tarde.');
    }
});
