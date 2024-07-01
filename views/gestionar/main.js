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
            // Enviar la solicitud POST al servidor
            const response = await fetch('/api/productos', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            // Mostrar mensaje de éxito o error
            if (response.ok) {
                alert(data.mensaje);
                // Limpiar el formulario después de agregar el producto
                formAgregarProducto.reset();
            } else {
                alert('Error al agregar el producto.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error en el servidor.');
        }
    });
});
