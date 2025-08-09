const form = document.getElementById("topupForm");
const user = localStorage.getItem("loggedInUser");
if (!user) window.location.href = "login.html";

let chats = JSON.parse(localStorage.getItem("chats")) || {};
if (!chats[user]) chats[user] = [];

const diamondSelect = document.getElementById("diamond");
const selectedGameId = localStorage.getItem("selectedGame") || "";
let selectedGameData = null;

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("games.json");
    const games = await res.json();

    selectedGameData = games.find(g => g.id === selectedGameId);

    // ✅ Debugging
    console.log("selectedGameId:", selectedGameId);
    console.log("selectedGameData:", selectedGameData);

    if (selectedGameData && selectedGameData.diamond && selectedGameData.diamond.length > 0) {
      diamondSelect.innerHTML = `<option value="">Pilih</option>`;
      selectedGameData.diamond.forEach(opt => {
        const option = document.createElement("option");
        option.value = `${opt.jumlah}|${opt.harga}`;
        option.textContent = `${opt.jumlah} Diamond - Rp${opt.harga.toLocaleString()}`;
        diamondSelect.appendChild(option);
      });
    } else {
      diamondSelect.innerHTML = `<option value="">Tidak tersedia</option>`;
    }
  } catch (error) {
    console.error("Gagal memuat games.json:", error);
    diamondSelect.innerHTML = `<option value="">Gagal memuat</option>`;
  }
});

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const nickname = document.getElementById("nickname").value.trim();
  const userId = document.getElementById("userId").value.trim();
  const server = document.getElementById("server").value.trim();
  const diamondValue = diamondSelect.value;
  const payment = document.getElementById("payment").value;

  if (!nickname || !userId || !server || !diamondValue || !payment) {
    alert("⚠️ Semua kolom harus diisi!");
    return;
  }

  const [jumlahDiamond, hargaDiamond] = diamondValue.split("|");

  const orderSummary = 
`📦 *Pesanan Top-Up Baru*
🎮 Game: ${selectedGameData?.nama || selectedGameId}
👤 Nickname: ${nickname}
🆔 ID: ${userId} (Server: ${server})
💎 Diamond: ${jumlahDiamond}
💰 Harga: Rp${Number(hargaDiamond).toLocaleString()}
💳 Pembayaran: ${payment}
⏳ Status: *Menunggu diproses admin*`;

  const pesan = {
    sender: "user",
    text: orderSummary,
    time: new Date().toLocaleString(),
  };

  chats[user].push(pesan);
  localStorage.setItem("chats", JSON.stringify(chats));

  const notif = document.getElementById("notif");
  notif.style.display = "block";
  notif.textContent = "✅ Pesanan berhasil dikirim. Silakan cek halaman Chat untuk info lebih lanjut.";

  form.reset();

  setTimeout(() => {
    window.location.href = "chat.html";
  }, 3000);
});
