// extraction user de jwt
export function getTokenPayload() {
    const token = localStorage.getItem('jwt_token');
    if (!token) return null;
    const base64 = token.split('.')[1];
    return JSON.parse(new TextDecoder().decode(
        Uint8Array.from(atob(base64), c => c.charCodeAt(0))
    ));
}