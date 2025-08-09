// ✅ login.js
document.getElementById("loginForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Semua kolom harus diisi.");
    return;
  }

  const userData = localStorage.getItem(`user_${username}`);
  if (!userData) {
    alert("Akun tidak ditemukan.");
    return;
  }

  const user = JSON.parse(userData);
  if (user.password !== password) {
    alert("Password salah.");
    return;
  }

  localStorage.setItem("loggedInUser", username);
  window.location.href = "index.html";
});
