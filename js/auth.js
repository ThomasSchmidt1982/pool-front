const API = 'http://localhost:8080';

// si token existant et valide
if (localStorage.getItem('jwt_token')) window.location.href = 'html/dashboard.html';

// si pas de token actuellement
document.getElementById('btn-login').addEventListener('click', async () => {
    const email = document.getElementById('input-email').value
    const password = document.getElementById('input-password').value

    const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password})
    });

    if (!res.ok){
        document.getElementById('login-error').textContent = 'Identifiants invalides';
        document.getElementById('login-error').classList.remove('d-none');
        return;
    }
    const data = await res.json();
    localStorage.setItem('jwt_token', data.token);
    window.location.href = 'html/dashboard.html'
});

