const userList = document.getElementById("userList");
const userListMobile = document.getElementById("userListMobile");
const chatBox = document.getElementById("chatBox");
const adminMsg = document.getElementById("adminMsg");
const currentUserTitle = document.getElementById("currentUser");
const markDoneBtn = document.getElementById("markDone");
const deleteChatBtn = document.getElementById("deleteChatBtn");

let chats = JSON.parse(localStorage.getItem("chats")) || {};
let selectedUser = null;

// Render daftar user di desktop
function renderUserList() {
  userList.innerHTML = "";
  Object.keys(chats).forEach(username => {
    const li = document.createElement("li");
    li.textContent = username;
    li.dataset.username = username;
    li.onclick = () => loadUserChat(username);
    userList.appendChild(li);
  });
  syncMobileUserList(); // <- Sinkron ke mobile setiap kali dirender
}

// Sinkron daftar user dari desktop ke versi mobile
function syncMobileUserList() {
  userListMobile.innerHTML = "";
  userList.querySelectorAll("li").forEach(li => {
    const copy = li.cloneNode(true);
    const username = li.dataset.username;
    copy.onclick = () => {
      loadUserChat(username);
      document.getElementById("mobileUserList").classList.remove("open");
    };
    userListMobile.appendChild(copy);
  });
}

// Tampilkan chat user
function loadUserChat(username) {
  selectedUser = username;
  currentUserTitle.textContent = `💬 Chat dengan: ${username}`;
  markDoneBtn.disabled = false;
  deleteChatBtn.disabled = false;
  renderChatBox();
}

// Render isi chat
function renderChatBox() {
  chatBox.innerHTML = "";

  const userChats = chats[selectedUser] || [];
  userChats.forEach(msg => {
    const div = document.createElement("div");
    div.className = msg.sender === "admin" ? "msg admin" : "msg user";
    div.innerHTML = `
      ${msg.text ? `<p>${msg.text}</p>` : ""}
      ${msg.image ? `<img src="${msg.image}" style="max-width: 200px; border-radius: 10px;" />` : ""}
      <small>${msg.time}</small>
    `;
    chatBox.appendChild(div);
  });

  chatBox.scrollTop = chatBox.scrollHeight;
}

// Kirim pesan teks
function sendAdminMsg() {
  const text = adminMsg.value.trim();
  if (!text || !selectedUser) return;

  const newMsg = {
    sender: "admin",
    text,
    time: new Date().toLocaleString(),
  };

  chats[selectedUser].push(newMsg);
  localStorage.setItem("chats", JSON.stringify(chats));
  adminMsg.value = "";
  renderChatBox();
}

// Enter = kirim
adminMsg.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendAdminMsg();
  }
});

// Upload gambar
const imageInput = document.createElement("input");
imageInput.type = "file";
imageInput.accept = "image/*";
imageInput.style.display = "none";
document.body.appendChild(imageInput);

const uploadButton = document.createElement("button");
uploadButton.textContent = "📎";
uploadButton.title = "Kirim Gambar";
uploadButton.type = "button";
uploadButton.style.marginRight = "5px";
uploadButton.onclick = () => imageInput.click();

adminMsg.parentNode.insertBefore(uploadButton, adminMsg);

// Kirim gambar
imageInput.addEventListener("change", function () {
  const file = imageInput.files[0];
  if (!file || !selectedUser) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const newImageMsg = {
      sender: "admin",
      image: e.target.result,
      time: new Date().toLocaleString()
    };

    chats[selectedUser].push(newImageMsg);
    localStorage.setItem("chats", JSON.stringify(chats));
    renderChatBox();
  };
  reader.readAsDataURL(file);
});

// Tandai selesai
markDoneBtn.onclick = () => {
  if (!selectedUser) return;

  const doneMsg = {
    sender: "admin",
    text: "✅ Transaksi selesai. Terima kasih telah menggunakan layanan kami!",
    time: new Date().toLocaleString()
  };

  chats[selectedUser].push(doneMsg);
  localStorage.setItem("chats", JSON.stringify(chats));
  renderChatBox();
};

// Hapus chat
deleteChatBtn.onclick = () => {
  if (!selectedUser) return;
  const confirmDelete = confirm(`Hapus semua chat dengan "${selectedUser}"?`);
  if (confirmDelete) {
    delete chats[selectedUser];
    localStorage.setItem("chats", JSON.stringify(chats));
    selectedUser = null;
    renderUserList();
    currentUserTitle.textContent = "💬 Pilih Pengguna";
    chatBox.innerHTML = "";
    markDoneBtn.disabled = true;
    deleteChatBtn.disabled = true;
  }
};

// Deteksi perubahan dari chat.html
window.addEventListener("storage", () => {
  const updatedChats = JSON.parse(localStorage.getItem("chats")) || {};
  chats = updatedChats;
  renderUserList();
  if (selectedUser && chats[selectedUser]) renderChatBox();
});

// Inisialisasi
renderUserList();
