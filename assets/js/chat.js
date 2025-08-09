const chatBox = document.getElementById("chatBox");
const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const fileInput = document.getElementById("fileInput");
const previewContainer = document.getElementById("previewContainer");

const user = localStorage.getItem("loggedInUser");
if (!user) window.location.href = "login.html";

let chats = JSON.parse(localStorage.getItem("chats")) || {};
if (!chats[user]) chats[user] = [];

// Fungsi scroll halus ke bawah
function scrollToBottom() {
  if (!chatBox) return;
  chatBox.scrollTo({
    top: chatBox.scrollHeight,
    behavior: "smooth"
  });
}

// Render chat
function renderChats() {
  chatBox.innerHTML = "";

  chats[user].forEach((msg) => {
    const bubble = document.createElement("div");
    bubble.classList.add("chat-bubble", msg.sender);

    if (msg.image) {
      const img = document.createElement("img");
      img.src = msg.image;
      img.style.maxWidth = "200px";
      img.style.borderRadius = "10px";
      img.style.marginTop = "5px";

      // Pastikan scroll setelah gambar selesai load
      img.onload = scrollToBottom;
      bubble.appendChild(img);
    }

    if (msg.text) {
      const text = document.createElement("div");
      text.innerHTML = msg.text.replace(/\n/g, "<br>");
      bubble.appendChild(text);
    }

    const time = document.createElement("small");
    time.textContent = msg.time;
    time.style.display = "block";
    time.style.marginTop = "5px";
    time.style.fontSize = "10px";
    bubble.appendChild(time);

    chatBox.appendChild(bubble);
  });

  scrollToBottom();
}

// Kirim pesan
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = messageInput.value.trim();
  const file = fileInput.files[0];

  if (!text && !file) return;

  const msg = {
    sender: "user",
    text: text || "",
    image: "",
    time: new Date().toLocaleString(),
  };

  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = function (e) {
      msg.image = e.target.result;
      saveMessage(msg);
    };
    reader.readAsDataURL(file);
  } else {
    saveMessage(msg);
  }

  messageInput.value = "";
  fileInput.value = null;
  previewContainer.innerHTML = "";
});

// Simpan pesan ke localStorage
function saveMessage(msg) {
  chats[user].push(msg);
  localStorage.setItem("chats", JSON.stringify(chats));
  renderChats();
}

// Preview gambar sebelum kirim
fileInput.addEventListener("change", () => {
  previewContainer.innerHTML = "";

  const file = fileInput.files[0];
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = document.createElement("img");
      img.src = e.target.result;
      img.classList.add("preview-image");
      previewContainer.appendChild(img);
    };
    reader.readAsDataURL(file);
  }
});

// Auto-balasan jika user tulis "status"
window.addEventListener("load", () => {
  renderChats();

  const lastMsg = chats[user].slice(-1)[0];
  if (lastMsg && lastMsg.text?.toLowerCase().includes("status")) {
    setTimeout(() => {
      const statusReply = {
        sender: "admin",
        text: "⏳ Pesanan kamu sedang diproses, mohon tunggu ya kak!",
        time: new Date().toLocaleString(),
      };
      chats[user].push(statusReply);
      localStorage.setItem("chats", JSON.stringify(chats));
      renderChats();
    }, 1000);
  }
});

// Update chat ketika localStorage berubah (real-time simulasi)
window.addEventListener("storage", () => {
  const updatedChats = JSON.parse(localStorage.getItem("chats")) || {};
  chats = updatedChats;
  renderChats();
});

// Pastikan pesan terakhir terlihat saat input fokus di HP
messageInput.addEventListener("focus", scrollToBottom);

// Saat resize (misal keyboard muncul di HP)
window.addEventListener("resize", scrollToBottom);
