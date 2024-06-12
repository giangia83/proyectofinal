// Selecciona el formulario de registro por su ID
const registroForm = document.querySelector('#registro-form');

// Escucha el evento de envío del formulario
registroForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Previene el comportamiento predeterminado de enviar el formulario

    // Aquí puedes realizar cualquier validación adicional del formulario si es necesario

    try {
        // Realiza cualquier operación de registro, como enviar datos al servidor, guardar en la base de datos, etc.

        // Después de que el usuario se haya registrado exitosamente, redirige a la página de inicio de sesión
        window.location.href = '/iniciarsesion';
    } catch (error) {
        console.error('Error al procesar el formulario de registro:', error);
        // Maneja el error de acuerdo a tus necesidades, por ejemplo, mostrando un mensaje de error al usuario
    }
});
