import {API} from "./config.js";
import {getTokenPayload} from "./utils.js";

// si token absent -> retour index.html
if (!localStorage.getItem('jwt_token')) window.location.href = '../index.html';


const token = localStorage.getItem('jwt_token');
async function loadPoolStatus() {
    try {
        const res = await fetch(`${API}/pool/status`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) return;
        const data = await res.json();
        document.getElementById('max-capacity').textContent = data.maxCapacity;
        document.getElementById('occupancy').textContent = data.occupancy;
        document.getElementById('current-capacity').textContent = data.currentCapacity;
    } catch (e) {
        console.error('Erreur pool status', e);
    }
}

// affichage nom + prenom + role de l'utilisateur connecté
const user = getTokenPayload();
document.getElementById('user-name').textContent=`${user.firstname} ${user.lastname}`
document.getElementById('user-role').textContent = user.role;
console.log(user.firstname +" "+ user.lastname)

// logout
document.getElementById('btn-logout').addEventListener('click', () => {
    localStorage.removeItem('jwt_token');
    window.location.href = '../index.html';
});

// recherche infos users
async function loadUsers() {
    const res = await fetch(`${API}/users`, {
        method: 'GET',
        headers: {'Authorization': `Bearer ${token}`}
    });
if (!res.ok) return;
    const data = await res.json();

    const tbody = document.querySelector('#users-table tbody');

data.forEach(user=> {
    const tr = document.createElement('tr');
    tr.innerHTML = `
    <td>${user.firstname}</td>
    <td>${user.lastname}</td>
    <td>${user.email}</td>
    <td>${user.isActive ? 'Oui' : 'Non'}</td>
`;
    tbody.appendChild(tr);
})
    document.getElementById('btn-users').classList.remove('d-none');
}

// recherche infos employees
async function loadEmployee() {
    const res = await fetch(`${API}/employees`, {
        method: 'GET',
        headers: {'Authorization': `Bearer ${token}`}
    });
    if (!res.ok) return;
    const data = await res.json();

    const tbody = document.querySelector('#employees-table tbody');

    data.forEach(employee => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
    <td>${employee.firstname}</td>
    <td>${employee.lastname}</td>
    <td>${employee.email}</td>
    <td>${employee.isActive ? 'Oui' : 'Non'}</td>
`;
        tbody.appendChild(tr);
    })
    document.getElementById('btn-employees').classList.remove('d-none');
}

// Main
loadPoolStatus();
setInterval(loadPoolStatus, 15000)
if(user.role === 'ROLE_ADMIN'){
    loadUsers()
    loadEmployee()
}