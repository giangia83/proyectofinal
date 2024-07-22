const registroForm = document.querySelector('#registro-form');

registroForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nombre = document.querySelector('#inputNombre').value;
    const correo = document.querySelector('#inputEmail').value;
    const contraseña = document.querySelector('#inputPassword').value;
    const direccion = document.querySelector('#inputDireccion').value;
    const ciudad = document.querySelector('#inputCiudad').value;
    const rif = document.querySelector('#inputRif').value;
    const number = document.querySelector('#inputNumber').value;

    // Validación básica de campos
    if (!nombre || !correo || !contraseña || !direccion || !ciudad || !rif || !number) {
        alert('Por favor completa todos los campos.');
        return;
    }

    try {
        const respuesta = await fetch('/usuarios', { // Cambiar '/api/users' a '/usuarios'
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre: nombre,
                correo: correo,
                contraseña: contraseña,
                direccion: direccion,
                ciudad: ciudad,
                rif: rif,
                number: number
            })
        });
        

        const datos = await respuesta.json();

        if (respuesta.ok) {
            console.log('Usuario creado exitosamente');
            window.location.href = '/iniciarsesion';
        } else {
            console.error('Error al registrar usuario:', datos.error || respuesta.statusText);
            alert('Error al registrar usuario. Por favor, inténtalo de nuevo más tarde.');
        }
    } catch (error) {
        console.error('Error al procesar el formulario de registro:', error);
        alert('Error al procesar el formulario de registro. Por favor, inténtalo de nuevo más tarde.');
    }
});
