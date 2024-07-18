const form = document.getElementById('configuracionForm'); // Seleccionar el formulario por su ID
const usuarioId = '<%= usuarioActual._id %>'; // Obtener el ID del usuario desde EJS

form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevenir el envío del formulario por defecto

    const formData = new FormData(form); // Obtener datos del formulario

    const data = {
        nombre: formData.get('nombre'),
        correo: formData.get('correo'),
        contraseña: formData.get('contraseña'),
        direccion: formData.get('direccion'),
        ciudad: formData.get('ciudad'),
        rif: formData.get('rif'),
        number: formData.get('number')
    };

    try {
        const response = await fetch(`/api/users/editar/${usuarioId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Error al editar el usuario');
        }

        const responseData = await response.json();
        console.log('Usuario actualizado:', responseData);
        // Aquí puedes hacer algo con la respuesta, como mostrar un mensaje de éxito o redirigir

    } catch (error) {
        console.error('Error al editar el usuario:', error.message);
        // Aquí puedes manejar el error de alguna manera, como mostrar un mensaje de error
    }
});
