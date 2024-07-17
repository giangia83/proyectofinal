const form = document.getElementById('configuracionForm'); // Seleccionar el formulario por su ID
form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevenir el envío del formulario por defecto

    const formData = new FormData(form); // Obtener datos del formulario

    try {
        const response = await fetch(`/api/users/editar/<%= usuario._id %>`, {
            method: 'PUT',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Error al editar el usuario');
        }

        const data = await response.json();
        console.log('Usuario actualizado:', data);
        // Aquí puedes hacer algo con la respuesta, como mostrar un mensaje de éxito
    } catch (error) {
        console.error('Error al editar el usuario:', error.message);
        // Aquí puedes manejar el error de alguna manera, como mostrar un mensaje de error
    }
});

