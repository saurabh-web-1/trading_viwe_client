// src/utils/auth.js



export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("user_logged_in");

  window.location.href = "/login";
}
