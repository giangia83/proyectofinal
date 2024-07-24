document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formulario');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const userId = form.dataset.id;

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

            // Mostrar el modal de éxito
            const modal = new bootstrap.Modal(document.getElementById('actualizacionExitosaModal'));
            modal.show();

        } catch (error) {
            console.error('Error al actualizar el usuario:', error);
            alert('Hubo un problema al actualizar el usuario. Por favor, intenta de nuevo.');
        }
    });
});
