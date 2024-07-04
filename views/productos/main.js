const card = document.getElementById('myCard');

  // Función para marcar como seleccionado al hacer click
  function selectCard() {
    // Cambiar tamaño y opacidad del div
    card.style.transform = 'scale(0.95)';
    card.style.opacity = '0.7';

    // Reemplazar imagen por icono de check
    const img = card.querySelector('.img-fluid');
    img.style.filter = 'blur(3px)';
    // Mostrar el icono de check
    const checkIcon = card.querySelector('.check-icon');
    checkIcon.style.display = 'block';

    // Agregar la clase 'selected' para estilos adicionales si es necesario
    card.classList.add('selected');
  }

  // Añadir evento de click al div
  card.addEventListener('click', selectCard);

  // Script para agregar al carrito y mostrar alerta
document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.addToCart');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productName = button.getAttribute('data-nombre');
            showAlert(productName);
        });
    });

    function showAlert(productName) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-success';
        alert.textContent = `${productName} ha sido agregado al carrito`;

        const container = document.querySelector('.container'); // Cambia .container por el selector adecuado de tu página
        container.appendChild(alert);

        setTimeout(() => {
            alert.remove();
        }, 5000); // Desaparece la alerta después de 5 segundos
    }
});
