export function getToken() {
  if (typeof window === "undefined") return null;

  return localStorage.getItem("token");
}

export function setToken(token) {
  localStorage.setItem("token", token);
}

export function removeToken() {
  localStorage.removeItem("token");
  localStorage.removeItem("userName");
}

export function getUserName() {
  if (typeof window === "undefined") return null;

  return localStorage.getItem("userName");
}

export function setUserName(name) {
  localStorage.setItem("userName", name);
}