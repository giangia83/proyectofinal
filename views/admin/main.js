document.getElementById('adminForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    const data = {};
    formData.forEach((value, key) => data[key] = value);
    try {
        const response = await fetch(this.action, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        if (response.ok) {
            // Manejar la respuesta exitosa
            console.log('Usuario actualizado:', result);
        } else {
            // Manejar el error
            console.error('Error al actualizar usuario:', result);
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
});
