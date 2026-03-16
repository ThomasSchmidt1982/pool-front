import {API} from "./config.js";
import {getTokenPayload, isTokenValid} from "./utils.js";

// si token absent -> retour index.html
if (!localStorage.getItem('jwt_token') && isTokenValid()) window.location.href = '../index.html';

// affichage du statut piscine
const token = localStorage.getItem('jwt_token');

async function loadPoolStatus() {
    try {
        const res = await fetch(`${API}/pool/status`, {
            headers: {'Authorization': `Bearer ${token}`}
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
document.getElementById('user-name').textContent = `${user.firstname} ${user.lastname}`
document.getElementById('user-role').textContent = user.role;

// logout
document.getElementById('btn-logout').addEventListener('click', () => {
    localStorage.removeItem('jwt_token');
    window.location.href = '../index.html';
});

// recherche des différents tickets
async function loadTicketsKinds() {
    const res = await fetch(`${API}/tickets/kinds`, {
        method: 'GET',
        headers: {'Authorization': `Bearer ${token}`}
    });
    if (!res.ok) return;
    const kinds = await res.json();

    const select = document.getElementById('kinds-select');
    kinds.forEach(kind => {
        const option = document.createElement('option');
        option.value = kind.id;
        option.textContent = `${kind.name} --- ${kind.price}€`;
        select.appendChild(option)
    })

}

// recherche infos users
async function loadUsers() {
    const res = await fetch(`${API}/users`, {
        method: 'GET',
        headers: {'Authorization': `Bearer ${token}`}
    });
    if (!res.ok) return;
    const data = await res.json();

    const tbody = document.querySelector('#users-table tbody');

    data.forEach(user => {
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

// recherche user barre de recherce (nom ou prenom)
async function searchUsers() {

    const q = document.getElementById('user-search').value;
    if (q.length < 2) return;

    const res = await fetch(`${API}/users/search?q=${q}`, {
        headers: {'Authorization': `Bearer ${token}`}
    });
    const users = await res.json();

    const list = document.getElementById('user-suggestions');
    list.innerHTML = '';
    users.forEach(user => {
        const li = document.createElement('li');
        li.className = 'list-group-item list-group-item-action';
        li.textContent = `${user.firstname} ${user.lastname}`;
        li.addEventListener('click', () => {
            document.getElementById('selected-user-id').value = user.id;
            document.getElementById('user-search').value = `${user.firstname} ${user.lastname}`;
            document.getElementById('btn-sell-ticket').disabled = false;
            list.innerHTML = '';
        });
        list.appendChild(li);
    });
}

// vendre un ticket
async function sellTicket() {
    const userId = document.getElementById('selected-user-id').value
    const ticketKindId = document.getElementById('kinds-select').value

    if (!userId) {
        alert('Veuillez sélectionner un client');
        return;
    }

    const res = await fetch(`${API}/users/${userId}/tickets`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ticketKindId: parseInt(ticketKindId)})

    });
    console.log(res.status);
    if (!res.ok) {
        document.getElementById('sell-error').classList.remove('d-none');
        return;
    }
    document.getElementById('sell-success').classList.remove('d-none');
    setTimeout(() => {
        document.getElementById('sell-success').classList.add('d-none')
        document.getElementById('btn-sell-ticket').disabled = true;
    }, 3000);
}

function updateTime() {
    const now = new Date();
    document.getElementById('current-time').textContent = now.toLocaleString('fr-FR');
}


// Main
loadPoolStatus();
setInterval(loadPoolStatus, 15000)
updateTime();
setInterval(updateTime, 1000);

if (user.role === 'ROLE_ADMIN' || user.role === 'ROLE_EMPLOYEE') {

    document.getElementById('buy-section').classList.remove('d-none');
    document.getElementById('btn-sell-ticket').disabled = true;

    loadTicketsKinds();
    document.getElementById('btn-sell-ticket').addEventListener('click', sellTicket);

    let searchTimeout;
    document.getElementById('user-search').addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(searchUsers, 300);
    });
}

if (user.role === 'ROLE_ADMIN') {
    document.getElementById('admin-section').classList.remove('d-none');
    loadUsers();
    loadEmployee();
}

if (user.role === 'ROLE_USER') {
}