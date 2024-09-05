// Connect to the WebSocket server
const socket = io();

// Elements
const roomList = document.getElementById('roomList');
const chatWindow = document.getElementById('chatWindow');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const toggleThemeBtn = document.getElementById('toggleThemeBtn');
const newRoomInput = document.getElementById('newRoomInput');
const createRoomBtn = document.getElementById('createRoomBtn');
const roomTitle = document.getElementById('roomTitle');

// Variables
let currentRoom = 'General';

// Functions
function addMessage(message, self = false) {
    const messageBubble = document.createElement('div');
    messageBubble.classList.add('chat-bubble');
    if (self) {
        messageBubble.classList.add('self');
    }
    messageBubble.textContent = message;
    chatWindow.appendChild(messageBubble);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Event Listeners
sendBtn.addEventListener('click', () => {
    const message = messageInput.value;
    if (message.trim()) {
        socket.emit('chatMessage', { room: currentRoom, message });
        addMessage(message, true);
        messageInput.value = '';
    }
});

createRoomBtn.addEventListener('click', () => {
    const newRoom = newRoomInput.value.trim();
    if (newRoom) {
        socket.emit('createRoom', newRoom);
        newRoomInput.value = '';
    }
});

toggleThemeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Socket Events
socket.on('message', (data) => {
    if (data.room === currentRoom) {
        addMessage(data.message);
    }
});

socket.on('roomList', (rooms) => {
    roomList.innerHTML = '';
    rooms.forEach(room => {
        const roomItem = document.createElement('li');
        roomItem.textContent = room;
        roomItem.addEventListener('click', () => {
            currentRoom = room;
            roomTitle.textContent = room;
            chatWindow.innerHTML = '';
            socket.emit('joinRoom', room);
        });
        roomList.appendChild(roomItem);
    });
});

// Initial Room Join
socket.emit('joinRoom', currentRoom);
