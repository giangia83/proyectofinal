
document.getElementById('adminForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(`/user/editar/${'<%= usuario._id %>'}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Información actualizada exitosamente');
            location.reload();  // Recargar la página para ver los cambios
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.error}`);
        }
    } catch (error) {
        console.error('Error al actualizar la información:', error);
        alert('Error interno del servidor.');
    }
});

