import {API} from "./config.js";

// GET pool/status
export async function getPoolStatus(token) {
    try {
        const res = await fetch(`${API}/pool/status`, {
            method:'GET',
            headers: {'Authorization': `Bearer ${token}`}
        });
        if (!res.ok) return;
        return await res.json();
    } catch (e) {
        console.error('Erreur pool status', e);
    }
}

// GET tickets/kinds
export async function getTicketsKinds(token) {
    try {
        const res = await fetch(`${API}/tickets/kinds`, {
            method: 'GET',
            headers: {'Authorization': `Bearer ${token}`}
        });
        if (!res.ok) return;
        return await res.json();
    } catch (e) {
        console.error('Erreur tickets kinds', e);
    }
}

// GET users
export async function getUsers(token) {
    try {
        const res = await fetch(`${API}/users`, {
            method: 'GET',
            headers: {'Authorization': `Bearer ${token}`}
        });
        if (!res.ok) return;
        return await res.json();
    } catch (e) {
        console.error('Erreur users', e);
    }
}

// GET employees
export async function getEmployees(token) {
    try {
        const res = await fetch(`${API}/employees`, {
            method: 'GET',
            headers: {'Authorization': `Bearer ${token}`}
        });
        if (!res.ok) return;
        return await res.json();
    } catch (e) {
        console.error('Erreur employees', e);
    }
}

// GET users/search
export async function getUserSearch(token, q) {
    try {
        const res = await fetch(`${API}/users/search?q=${q}`, {
            method: 'GET',
            headers: {'Authorization': `Bearer ${token}`}
        });
        if (!res.ok) return;
        return await res.json();
    } catch (e) {
        console.error('Erreur users search', e);
    }
}

// POST users/{userId}/ticket
export async function postUsersTickets(token, userId, ticketKindId) {
    try {
        const res = await fetch(`${API}/users/${userId}/tickets`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ticketKindId: parseInt(ticketKindId)})
        });
        if (!res.ok) return;
        return await res.json();
    } catch (e) {
        console.error('Erreur tickets', e);
    }
}
