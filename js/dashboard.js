import {API} from "./config.js";
import {getTokenPayload} from "./utils.js";

// si token absent
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

const user = getTokenPayload();
document.getElementById('user-name').textContent=`${user.firstname} ${user.lastname}`
document.getElementById('user-role').textContent = user.role;


// logout
document.getElementById('btn-logout').addEventListener('click', () => {
    localStorage.removeItem('jwt_token');
    window.location.href = '../index.html';
});

loadPoolStatus();
setInterval(loadPoolStatus, 15000)
