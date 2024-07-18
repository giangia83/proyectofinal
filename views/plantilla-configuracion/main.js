const formulario = document.getElementById('formulario');
const userId = formulario.getAttribute('data-id'); // Suponiendo que obtienes el ID de alguna manera

formulario.addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData(formulario);

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
        const response = await fetch(`/api/users/editar/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Error al actualizar el usuario');
        }

        // Mostrar notificación de éxito
        alert('Usuario actualizado con éxito');

        // Redireccionar o realizar alguna acción adicional si es necesario
        window.location.href = '/ruta-de-redireccion'; // Redirigir a una nueva página
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al actualizar el usuario');
    }
});
