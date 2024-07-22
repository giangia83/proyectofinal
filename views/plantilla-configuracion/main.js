// main.js (o el nombre que le hayas dado a tu archivo JavaScript para este componente)

document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formulario');

    formulario.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evitar el envío predeterminado del formulario

        const formData = new FormData(formulario);
        const id = formulario.dataset.id; // Obtener el id del atributo data-id

        try {
            const response = await fetch(`/api/users/editar/${id}`, {
                method: 'PUT',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Error al actualizar usuario');
            }

            alert('Usuario actualizado correctamente');
            // Aquí puedes redireccionar a otra página, mostrar un mensaje de éxito, etc.
        } catch (error) {
            console.error('Error:', error);
            alert('Hubo un error al actualizar el usuario');
            // Manejar el error (mostrar mensaje de error, etc.)
        }
    });
});
