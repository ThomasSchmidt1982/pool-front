import {API} from './config.js';
import {isTokenValid} from "./utils.js";

// Si l'utilisateur a déjà un token valide, on le redirige directement vers le dashboard
// (pas besoin de se reconnecter)
if (localStorage.getItem('jwt_token') && isTokenValid())
{
    window.location.href = 'html/dashboard.html';
}

// --- CONNEXION ---
document.getElementById('btn-login').addEventListener('click', async () => {
    const email = document.getElementById('input-email').value
    const password = document.getElementById('input-password').value

    try {
        // Envoi des identifiants à l'API
        const res = await fetch(`${API}/auth/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password})
        });

        // Si l'API répond avec une erreur (ex: mauvais mot de passe), on affiche le message
        if (!res.ok){
            document.getElementById('login-error').textContent = 'Identifiants invalides';
            document.getElementById('login-error').classList.remove('d-none');
            return;
        }

        // Connexion réussie : on sauvegarde le token JWT et on redirige vers le dashboard
        const data = await res.json();
        localStorage.setItem('jwt_token', data.token);
        window.location.href = 'html/dashboard.html'
    } catch (e) {
        // Erreur réseau (ex: serveur inaccessible)
        console.error('Erreur login', e);
    }
});

// --- INSCRIPTION ---
// Initialisation du composant Bootstrap qui affiche/cache le formulaire d'inscription
const collapse = new bootstrap.Collapse(document.getElementById('register-form'), {toggle: false });

// Afficher ou cacher le formulaire d'inscription au clic sur le bouton
document.getElementById('btn-show-register').addEventListener('click', (e)=>{
    e.preventDefault(); // empêche le rechargement de la page (comportement par défaut d'un lien)
    collapse.toggle();
})

// Soumettre le formulaire d'inscription
document.getElementById('btn-register').addEventListener('click', async () => {
    try {
        // Envoi des données du formulaire à l'API pour créer un compte
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

        // Si l'API répond avec une erreur (ex: email déjà utilisé), on affiche le message
        if (!res.ok) {
            document.getElementById('register-error').textContent = 'Erreur lors de la création du compte';
            document.getElementById('register-error').classList.remove('d-none');
            return;
        }

        // Inscription réussie : on affiche le message de succès et on referme le formulaire après 3s
        document.getElementById('register-success').textContent = 'Compte créé ! Vous pouvez vous connecter.';
        document.getElementById('register-success').classList.remove('d-none');
        setTimeout(() => collapse.toggle(), 3000);
    } catch (e) {
        // Erreur réseau (ex: serveur inaccessible)
        console.error('Erreur register', e);
    }
})