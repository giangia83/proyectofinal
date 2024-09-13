// Función para convertir la coma a punto en números decimales
const convertirDecimal = (valor) => valor.replace(',', '.');

// Agregar producto
document.getElementById('formAgregarProducto').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evitar el envío estándar del formulario
  
    // Obtener valores del formulario
    const nombre = document.getElementById('inputNombre').value.trim();
    const costo = convertirDecimal(document.getElementById('inputCosto').value.trim());
    const precio = convertirDecimal(document.getElementById('inputPrecio').value.trim());
    const file = document.getElementById('inputImagen').files[0];
    const categoria = document.querySelector('#dropdownCategoria .dropdown-item.active');
  
    if (!nombre || !costo || !precio || !file || !categoria) {
        alert('Todos los campos son requeridos, incluyendo la categoría');
        return;
    }
  
    const categoriaSeleccionada = categoria.textContent.trim();
  
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('costo', costo);
    formData.append('precio', precio);
    formData.append('inputImagen', file);
    formData.append('categoria', categoriaSeleccionada);
  
    try {
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

        // Mostrar el mensaje de éxito
        const mensajeExito = document.getElementById('mensajeExito');
        mensajeExito.style.display = 'block';
        setTimeout(() => {
            mensajeExito.style.display = 'none';
        }, 5000); // Ocultar el mensaje después de 5 segundos

    } catch (error) {
        console.error('Error al subir producto:', error);
        alert('Hubo un problema al subir el producto: ' + error.message);
    }
});
  
// Actualizar la categoría activa
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
    if (!id || typeof id !== 'string') {
        console.error('ID del producto no es válido:', id);
        alert('ID del producto no es válido');
        return;
    }

    // Asegúrate de que el backend te devuelve los datos del producto referenciado
    fetch(`/api/productos/${id}`)
      .then(response => response.json())
      .then(producto => {
        // Asignar los datos del producto al formulario para edición
        document.getElementById('productoId').value = producto._id;
        document.getElementById('inputNombreEditar').value = producto.nombre;
        document.getElementById('inputCostoEditar').value = producto.costo;
        document.getElementById('inputPrecioEditar').value = producto.precio;
      })
      .catch(error => {
        console.error('Error al cargar el producto:', error);
        alert('Hubo un problema al cargar el producto. Por favor, intenta nuevamente.');
      });
}


// Actualizar producto
document.getElementById('formEditarProducto').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evitar el envío estándar del formulario

    const id = document.getElementById('productoId').value.trim();
    const nombre = document.getElementById('inputNombreEditar').value.trim();
    const costo = convertirDecimal(document.getElementById('inputCostoEditar').value.trim());
    const precio = convertirDecimal(document.getElementById('inputPrecioEditar').value.trim());
    const file = document.getElementById('inputImagenEditar').files[0];

    if (!id || !nombre || !costo || !precio) {
        alert('Todos los campos son requeridos');
        return;
    }

    const formData = new FormData();
    formData.append('id', id);
    formData.append('nombre', nombre);
    formData.append('costo', costo);
    formData.append('precio', precio);
    if (file) {
        formData.append('imagen', file);
    }

    try {
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
        alert('Producto actualizado exitosamente');
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        alert('Hubo un problema al actualizar el producto: ' + error.message);
    }
});
