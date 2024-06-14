const formL = document.querySelector('#login-form');
const loginInput = document.querySelector('#inputEmail');
const passwordInput = document.querySelector('#inputPassword');


formL.addEventListener('submit', async e => {
    e.preventDefault();

    if (!loginInput.value || !passwordInput.value) {
        console.error('no puede estar vacio:', error);
        return;
    }

    try {
        const url = '/api/users';
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: loginInput.value,
                password: passwordInput.value
            })
        });

        if (!response.ok) {
            throw new Error('Error al iniciar sesión');
        }

        const data = await response.json();
        localStorage.setItem('usuario', JSON.stringify(data));
        window.location.href = '/cuenta'; // Redireccionar al usuario a la página de cuenta después del inicio de sesión
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
      
    }
});


