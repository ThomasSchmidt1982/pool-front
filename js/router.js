export function logout(){
    document.getElementById('btn-logout').addEventListener('click', () => {
        localStorage.removeItem('jwt_token');
        window.location.href = '../index.html';
    });
}