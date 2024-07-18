document.addEventListener('DOMContentLoaded', function() {
    const formulario = document.getElementById('formulario');
    const userId = formulario.getAttribute('data-id'); // Obtener el ID del usuario

    formulario.addEventListener('submit', async function(event) {
        event.preventDefault(); // Evitar el envío predeterminado del formulario

        const formData = new FormData(formulario);

        const data = {
            nombre: formData.get('nombre'),
            correo: formData.get('correo'),
            contraseña: formData.get('contraseña'),
            direccion: formData.get('direccion'),
            ciudad: formData.get('ciudad'),
            rif: formData.get('rif'),
            number: formData.get('number')
            // Agrega aquí los campos adicionales del usuario que deseas actualizar
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

            const result = await response.json();

            // Mostrar notificación de éxito
            alert('Usuario actualizado con éxito');

            // Redireccionar o realizar alguna acción adicional si es necesario
            window.location.href = '/'; // Redirigir a una nueva página
        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un error al actualizar el usuario');
        }
    });
});
