// ✅ register.js
document.getElementById("registerForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Semua kolom harus diisi.");
    return;
  }

  if (localStorage.getItem(`user_${username}`)) {
    alert("Username sudah terdaftar.");
    return;
  }

  const user = { username, password };
  localStorage.setItem(`user_${username}`, JSON.stringify(user));

  alert("Pendaftaran berhasil! Silakan login.");
  window.location.href = "login.html";
});
