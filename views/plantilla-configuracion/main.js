// Archivo form.js

// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Captura el formulario
    const form = document.getElementById('formulario');

    // Agrega un listener para el evento submit del formulario
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evita que se envíe el formulario de forma convencional

        // Obtiene el id del usuario del atributo data-id del formulario
        const userId = form.dataset.id;

        // Construye los datos del formulario
        const formData = {
            nombre: form.nombre.value,
            correo: form.correo.value,
            contraseña: form.contraseña.value,
            direccion: form.direccion.value,
            ciudad: form.ciudad.value,
            rif: form.rif.value,
            number: form.number.value
        };

        try {
            // Realiza una solicitud PUT al servidor
            const response = await fetch(`/usuarios/editar/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el usuario');
            }

            // Si la actualización fue exitosa, muestra un mensaje al usuario
            alert('Usuario actualizado correctamente');
            // Opcional: redirige a otra página o realiza acciones adicionales

        } catch (error) {
            console.error('Error al actualizar el usuario:', error);
            alert('Hubo un problema al actualizar el usuario. Por favor, intenta de nuevo.');
        }
    });
});
