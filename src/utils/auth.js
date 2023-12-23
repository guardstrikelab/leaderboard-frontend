const TokenKey = 'Admin-Token';

export function getToken() {
  return localStorage.getItem(TokenKey);
}

export function setToken(token) {
  localStorage.setItem(TokenKey, token);
}

export function removeToken() {
  localStorage.removeItem(TokenKey);
}

const JwtKey = 'Jwt-Token';

export function getJwtToken() {
  return localStorage.getItem(JwtKey);
}

export function setJwtToken(token) {
  localStorage.setItem(JwtKey, token);
}

export function removeJwtToken() {
  localStorage.removeItem(JwtKey);
}
