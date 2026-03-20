import {getTokenPayload, isTokenValid } from "./utils.js";
import {logout} from "./router.js";
import {getEmployees, getUsers, getPoolStatus, getTicketsKinds, getUserSearch, postUsersTickets} from "./api.js";

// affichage du statut piscine
async function loadPoolStatus() {
        const data = await getPoolStatus(token);
        if(!data) return;
        document.getElementById('max-capacity').textContent = data.maxCapacity;
        document.getElementById('occupancy').textContent = data.occupancy;
        document.getElementById('current-capacity').textContent = data.currentCapacity;
}

// recherche des différents tickets
async function loadTicketsKinds() {
        const kinds = await getTicketsKinds(token);
    if(!kinds) return;
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
        const data = await getUsers(token);
        if(!data) return;
        const tbody = document.querySelector('#users-table tbody');
        data.forEach(user => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
    <td>${user.firstname}</td>
    <td>${user.lastname}</td>
    <td>${user.email}</td>
    <td>${user.isActive ? 'Oui' : 'Non'}</td>`;
            tbody.appendChild(tr);
        })
        document.getElementById('btn-users').classList.remove('d-none');
}

// recherche infos employees
async function loadEmployee() {
        const data = await getEmployees(token);
    if(!data) return;
    const tbody = document.querySelector('#employees-table tbody');
        data.forEach(employee => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
        <td>${employee.firstname}</td>
        <td>${employee.lastname}</td>
        <td>${employee.email}</td>
        <td>${employee.isActive ? 'Oui' : 'Non'}</td>`;
            tbody.appendChild(tr);
        })
        document.getElementById('btn-employees').classList.remove('d-none');
}

// recherche d'un "user" dans la barre de recherche
async function searchUsers() {
    const q = document.getElementById('user-search').value;
    if (q.length < 2) return;
        const users = await getUserSearch(token,q);
    if(!users) return;
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

// Vente d'un ticket
async function sellTicket() {
    const userId = document.getElementById('selected-user-id').value
    const ticketKindId = document.getElementById('kinds-select').value

        const res = await postUsersTickets(token, userId, ticketKindId)

        if (!res) {
            document.getElementById('sell-error').classList.remove('d-none');
            return;
        }
        document.getElementById('sell-success').classList.remove('d-none');
        setTimeout(() => {
            document.getElementById('sell-success').classList.add('d-none')
            document.getElementById('btn-sell-ticket').disabled = true;
        }, 3000);

    }


// affichage de l'heure
function hour() {
    const now = new Date();
    document.getElementById('current-time').textContent = now.toLocaleString('fr-FR');
}

function initsAdminEmployee() {
    document.getElementById('buy-section').classList.remove('d-none');
    document.getElementById('btn-sell-ticket').disabled = true;
    document.getElementById('btn-sell-ticket').addEventListener('click', sellTicket);
    loadTicketsKinds();
}

function initsAdmin() {
    document.getElementById('admin-section').classList.remove('d-none');
}

function initsUserInfo(){
    document.getElementById('user-name').textContent = `${user.firstname} ${user.lastname}`
    document.getElementById('user-role').textContent = user.role;
}



// Main
// Pour tous les Roles (USER, ADMIN, EMPLOYEE)

// si token absent -> retour index.html
if (!localStorage.getItem('jwt_token') || !isTokenValid()) window.location.href = '../index.html';
const token = localStorage.getItem('jwt_token');
// affichage nom + prenom + role de l'utilisateur connecté
const user = getTokenPayload();
initsUserInfo();
logout();

loadPoolStatus();
setInterval(loadPoolStatus, 15000)
hour();
setInterval(hour, 1000);


if (user.role === 'ROLE_ADMIN' || user.role === 'ROLE_EMPLOYEE') {
    initsAdminEmployee();

    // Chargement et refresh de la search barre Client
    let searchTimeout;
    document.getElementById('user-search').addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(searchUsers, 300);
    });
}

if (user.role === 'ROLE_ADMIN') {
    initsAdmin();
    loadUsers();
    loadEmployee();
}

