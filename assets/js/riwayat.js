// ✅ riwayat.js - Menampilkan riwayat transaksi user

function loadRiwayat() {
  const username = localStorage.getItem("currentUser");
  if (!username) {
    alert("Silakan login terlebih dahulu.");
    window.location.href = "login.html";
    return;
  }

  const transaksi = JSON.parse(localStorage.getItem("transaksi")) || [];
  const riwayatUser = transaksi.filter(t => t.username === username);

  const container = document.getElementById("riwayat-container");

  if (riwayatUser.length === 0) {
    container.innerHTML = "<p>Belum ada transaksi.</p>";
    return;
  }

  riwayatUser.forEach(item => {
    const card = document.createElement("div");
    card.className = "riwayat-card";
    card.innerHTML = `
      <h3>${item.game}</h3>
      <p>ID: ${item.userId}</p>
      <p>Nominal: ${item.nominal}</p>
      <p>Metode: ${item.metode}</p>
      <p>Status: <strong>${item.status || "Diproses"}</strong></p>
      <small>${item.tanggal}</small>
    `;
    container.appendChild(card);
  });
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

window.onload = loadRiwayat;
