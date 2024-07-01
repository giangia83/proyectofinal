


document.addEventListener('DOMContentLoaded', () => {
    const formAgregarProducto = document.querySelector('#formAgregarProducto');

    formAgregarProducto.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Obtener valores del formulario
        const nombre = document.querySelector('#inputNombre').value;
        const precio = document.querySelector('#inputPrecio').value;
        const costo = document.querySelector('#inputCosto').value;
        const categoria = document.querySelector('#dropdownCategoria').textContent.trim(); // Obtener texto del dropdown
        const imagen = document.querySelector('#inputImagen').files[0]; // Archivo de imagen

        // Validación básica del formulario
        if (!nombre || !precio || !costo || !categoria || !imagen) {
            alert('Por favor completa todos los campos.');
            return;
        }

        // Crear objeto FormData para enviar los datos
        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('precio', precio);
        formData.append('costo', costo);
        formData.append('categoria', categoria);
        formData.append('imagen', imagen);

        try {
            // Enviar la solicitud POST al servidor utilizando fetch
            const response = await fetch('/api/subir-producto', {
                method: 'POST',
                body: formData
            });

            // Manejar la respuesta del servidor
            const data = await response.json();

            if (response.ok) {
                alert(data.message); // Mostrar mensaje de éxito
                formAgregarProducto.reset(); // Limpiar el formulario
            } else {
                alert(data.error); // Mostrar mensaje de error
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error en el servidor.'); // Mostrar mensaje de error genérico
        }
    });
});
