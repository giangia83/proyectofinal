 // JavaScript para manejar el menú hamburguesa en pantallas móviles
 const menuHamburguesa = document.getElementById('menuHamburguesa');
 const menuDesplegable = document.getElementById('menuDesplegable');

 if (menuHamburguesa && menuDesplegable) {
     menuHamburguesa.addEventListener('click', () => {
         menuDesplegable.classList.toggle('activo');
     });
 }

 document.querySelectorAll('.btn-star').forEach(button => {
    button.addEventListener('click', function(event) {
        event.preventDefault();
        const productoId = this.getAttribute('data-producto-id');

        fetch('/add-to-favorites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': '<%= csrfToken %>' // Incluye el token CSRF si usas uno
            },
            body: JSON.stringify({ productoId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Producto agregado a favoritos');
            } else {
                alert('Error al agregar el producto a favoritos');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al agregar el producto a favoritos');
        });
    });
});

// Función para añadir un producto a favoritos
async function addToFavorites(productId) {
    try {
        const response = await fetch('/fav/add-to-favorites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productoId })
        });
        
        const result = await response.json();
        if (result.success) {
            alert('Producto añadido a favoritos');
        } else {
            alert('Error al añadir producto a favoritos: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const favoriteButton = document.querySelector('.card.card-special a');
    const modal = document.getElementById('favoriteModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const closeModal = document.getElementById('closeModal');
  
    // Función para abrir el modal
    function openModal() {
      modal.style.display = 'block';
      modalOverlay.style.display = 'block';
      loadFavorites(); // Cargar productos favoritos en el modal
    }
  
    // Función para cerrar el modal
    function closeModalFunction() {
      modal.style.display = 'none';
      modalOverlay.style.display = 'none';
    }
  
    // Función para cargar los productos favoritos
    function loadFavorites() {
      const favoriteList = document.getElementById('favoriteList');
      favoriteList.innerHTML = ''; // Limpiar lista existente
  
      // Aquí deberías cargar los productos favoritos desde el servidor o desde almacenamiento local
      // Ejemplo de productos favoritos
      const favorites = [
        { name: 'Producto 1', description: 'Descripción 1' },
        { name: 'Producto 2', description: 'Descripción 2' }
      ];
  
      favorites.forEach(favorite => {
        const listItem = document.createElement('li');
        listItem.textContent = `${favorite.name} - ${favorite.description}`;
        favoriteList.appendChild(listItem);
      });
    }
  
    // Añadir eventos
    favoriteButton.addEventListener('click', openModal);
    closeModal.addEventListener('click', closeModalFunction);
    modalOverlay.addEventListener('click', closeModalFunction);
  });
  