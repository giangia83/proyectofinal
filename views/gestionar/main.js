// Agregar producto
document.getElementById('formAgregarProducto').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evitar el envío estándar del formulario
  
    // Obtener valores del formulario
    const nombre = document.getElementById('inputNombre').value;
    const costo = document.getElementById('inputCosto').value;
    const precio = document.getElementById('inputPrecio').value;
    const file = document.getElementById('inputImagen').files[0]; // Archivo de imagen seleccionado
    const categoria = document.querySelector('#dropdownCategoria .dropdown-item.active'); // Obtener la categoría seleccionada
  
    // Validar que los campos no estén vacíos
    if (nombre.trim() === '' || costo.trim() === '' || precio.trim() === '' || !file || !categoria) {
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
    formData.append('inputImagen', file); // Corregido el nombre del campo del archivo
    formData.append('categoria', categoriaSeleccionada);
  
    try {
        // Enviar datos al servidor usando fetch API
        const response = await fetch('/subir/upload', {
            method: 'POST',
            body: formData
        });
  
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al subir producto');
        }
  
        const data = await response.json();
        console.log('Producto subido exitosamente:', data);
        // Aquí puedes manejar la respuesta del servidor según sea necesario
        alert('Producto subido exitosamente');
    } catch (error) {
        console.error('Error al subir producto:', error);
        alert('Hubo un problema al subir el producto: ' + error.message);
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
 // Función para cargar los datos del producto en el modal
 function cargarProducto(id) {
    if (typeof id !== 'string' || !id.trim()) {
        console.error('ID del producto no es válido:', id);
        alert('ID del producto no es válido');
        return;
    }

    fetch(`/api/productos/${id}`)
      .then(response => response.json())
      .then(producto => {
        document.getElementById('productoId').value = producto._id;
        document.getElementById('inputNombreEditar').value = producto.nombre;
        document.getElementById('inputCostoEditar').value = producto.costo;
        document.getElementById('inputPrecioEditar').value = producto.precio;
        // Aquí puedes manejar la imagen si es necesario
      })
      .catch(error => {
        console.error('Error al cargar el producto:', error);
        alert('Hubo un problema al cargar el producto. Por favor, intenta nuevamente.');
      });
}

// Actualizar producto
document.getElementById('formEditarProducto').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evitar el envío estándar del formulario

    // Obtener valores del formulario
    const id = document.getElementById('productoId').value;
    const nombre = document.getElementById('inputNombreEditar').value;
    const costo = document.getElementById('inputCostoEditar').value;
    const precio = document.getElementById('inputPrecioEditar').value;
    const file = document.getElementById('inputImagenEditar').files[0]; // Archivo de imagen seleccionado

    // Validar que el ID del producto no esté vacío
    if (id.trim() === '') {
        alert('ID del producto no puede estar vacío');
        return;
    }

    // Validar que los campos no estén vacíos
    if (nombre.trim() === '' || costo.trim() === '' || precio.trim() === '') {
        alert('Todos los campos son requeridos');
        return;
    }

    // Crear objeto FormData para enviar datos y archivos al servidor
    const formData = new FormData();
    formData.append('id', id);
    formData.append('nombre', nombre);
    formData.append('costo', costo);
    formData.append('precio', precio);
    if (file) {
        formData.append('imagen', file); // Añadir el archivo de imagen si está presente
    }

    try {
        // Enviar datos al servidor usando fetch API
        const response = await fetch('/subir/actualizar-producto', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al actualizar producto');
        }

        const data = await response.json();
        console.log('Producto actualizado exitosamente:', data);
        // Aquí puedes manejar la respuesta del servidor según sea necesario
        alert('Producto actualizado exitosamente');
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        alert('Hubo un problema al actualizar el producto: ' + error.message);
    }
});
