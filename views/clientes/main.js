// Función para eliminar un usuario
function eliminarUsuario(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
        fetch(`/usuarios/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => {
            if (response.ok) {
                alert('Cliente eliminado exitosamente');
                // Eliminar el elemento del DOM
                document.getElementById(`heading-${id}`).closest('.card').remove();
            } else {
                alert('Error al eliminar el cliente');
            }
        })
        .catch(error => {
            console.error('Error al eliminar cliente:', error);
            alert('Error al eliminar el cliente');
        });
    }
}
