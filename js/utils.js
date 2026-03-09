
// extraction user de jwt
export function getTokenPayload() {
    const token = localStorage.getItem('jwt_token');
    if (!token) return null;
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
}