document.getElementById('formAgregarProducto').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evitar el envío estándar del formulario

    // Obtener valores del formulario
    const nombre = document.getElementById('inputNombre').value;
    const costo = document.getElementById('inputCosto').value;
    const precio = document.getElementById('inputPrecio').value;
    const file = document.getElementById('inputImagen').files[0]; // Archivo de imagen seleccionado
    const categoria = document.querySelector('#dropdownCategoria .dropdown-item.active'); // Obtener la categoría seleccionada

    // Validar que los campos no estén vacíos
    if (nombre.trim() === '' || costo.trim() === '' || precio.trim() === '' || !file|| !categoria) {
        alert('Todos los campos son requeridos, incluyendo la categoría');
        return;
    }

    // Obtener el texto de la categoría seleccionada
    const categoriaSeleccionada = categoria.textContent.trim();

    // Crear objeto FormData para enviar datos y archivos al servidor
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('costo', costo);
    formData.append('precio', precio);
   
    formData.append('categoria', categoriaSeleccionada);

    try {
        // Enviar datos al servidor usando fetch API
        const response = await fetch('/subir/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Error al subir producto');
        }

        const data = await response.json();
        console.log('Producto subido exitosamente:', data);
        // Aquí puedes manejar la respuesta del servidor según sea necesario
    } catch (error) {
        console.error('Error al subir producto:', error);
        alert('Hubo un problema al subir el producto. Por favor, intenta nuevamente.');
    }
});

// Agregar evento click a cada opción del dropdown para marcar como activa
document.querySelectorAll('#dropdownCategoria .dropdown-item').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelectorAll('#dropdownCategoria .dropdown-item').forEach(item => {
            item.classList.remove('active');
        });
        this.classList.add('active');
    });
});

