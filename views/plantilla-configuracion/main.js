document.addEventListener('DOMContentLoaded', function () {
      
    // Manejar el envío del formulario
    document.getElementById('configuracionForm').addEventListener('submit', function (event) {
      // Prevenir el envío por defecto del formulario
      event.preventDefault();
      
      // Realizar una confirmación opcional aquí si es necesario

      // Enviar el formulario usando fetch
      fetch(this.action, {
        method: this.method,
        body: new FormData(this)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
      })
      .then(data => {
        // Manejar la respuesta del servidor aquí (por ejemplo, mostrar un mensaje de éxito)
        console.log('Respuesta del servidor:', data);
        alert('¡Actualización exitosa!');
      })
      .catch(error => {
        // Manejar errores de red o del servidor
        console.error('Error en la solicitud:', error);
        alert('Ocurrió un error al actualizar la información.');
      });
    });
  });
