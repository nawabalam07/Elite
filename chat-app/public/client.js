const socket = io();

const joinScreen = document.getElementById('joinScreen');
const chatScreen = document.getElementById('chatScreen');
const joinBtn = document.getElementById('joinBtn');
const usernameInput = document.getElementById('username');
const roomInput = document.getElementById('room');
const roomNameEl = document.getElementById('roomName');
const usersList = document.getElementById('users');
const messagesUl = document.getElementById('messages');
const messageForm = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');
const leaveBtn = document.getElementById('leaveBtn');

let currentUser = "";

function addMessage(msg, type = "other") {
  const li = document.createElement('li');
  li.className = type;
  if (type === "system") {
    li.textContent = msg.text;
  } else {
    li.innerHTML = `<b>${msg.user}</b><br>${msg.text}`;
  }
  messagesUl.appendChild(li);
  messagesUl.scrollTop = messagesUl.scrollHeight;
}

joinBtn.addEventListener('click', () => {
  currentUser = usernameInput.value.trim() || "Guest";
  const room = roomInput.value.trim() || "lobby";
  socket.emit('join', { username: currentUser, room });
  roomNameEl.textContent = `Room: ${room}`;
  joinScreen.classList.add('hidden');
  chatScreen.classList.remove('hidden');
});

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = messageInput.value.trim();
  if (!text) return;
  socket.emit('message', { text });
  messageInput.value = "";
});

leaveBtn.addEventListener('click', () => window.location.reload());

socket.on('message', (msg) => {
  addMessage(msg, msg.user === currentUser ? "me" : "other");
});
socket.on('system', (msg) => addMessage(msg, "system"));

socket.on('users', (users) => {
  usersList.innerHTML = users.map(u => `<li>${u}</li>`).join('');
});
