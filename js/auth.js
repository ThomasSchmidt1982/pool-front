import {API} from './config.js';
import {isTokenValid} from "./utils";

// si token existant et valide
if (localStorage.getItem('jwt_token') && isTokenValid())
{
    window.location.href = 'html/dashboard.html';
}

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
const collapse = new bootstrap.Collapse(document.getElementById('register-form'), {toggle: false });

// formulaire d'enregistrement
// faire apparaitre le formulaire
document.getElementById('btn-show-register').addEventListener('click', (e)=>{
    e.preventDefault();
    collapse.toggle();
})

// soumettre le formulaire
document.getElementById('btn-register').addEventListener('click', async () => {

    // POST /users
    const res = await fetch(`${API}/users`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            lastname: document.getElementById('reg-lastname').value,
            firstname: document.getElementById('reg-firstname').value,
            email: document.getElementById('reg-email').value,
            password: document.getElementById('reg-password').value
        })
    });

    if (!res.ok) {
        document.getElementById('register-error').textContent = 'Erreur lors de la création du compte';
        document.getElementById('register-error').classList.toggle('d-none');
        console.log(res)
        return;
    }
    document.getElementById('register-success').textContent = 'Compte créé ! Vous pouvez vous connecter.';
    document.getElementById('register-success').classList.remove('d-none');
    setTimeout(() => collapse.toggle(), 3000);
})