
// si token existant et valide
if (!localStorage.getItem('jwt_token')) window.location.href = 'index.html';

document.getElementById('btn-logout').addEventListener('click', () => {
    localStorage.removeItem('jwt_token');
    window.location.href = 'index.html';
});


