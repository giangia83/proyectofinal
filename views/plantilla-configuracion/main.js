document.getElementById('configuracionForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Evita el envío predeterminado del formulario
    
    // Obtén los datos del formulario
    const formData = new FormData(this);
  
    try {
      const response = await fetch(this.action, {
        method: this.method,
        body: formData
      });
  
      if (!response.ok) {
        throw new Error('Error en la solicitud: ' + response.statusText);
      }
  
      // Manejar la respuesta como sea necesario
      console.log('Solicitud exitosa');
      // Puedes redirigir o mostrar un mensaje de éxito aquí
  
    } catch (error) {
      console.error('Error en la solicitud:', error);
      // Manejar errores y mostrar mensajes al usuario
    }
  });
  