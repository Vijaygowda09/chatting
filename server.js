const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

let rooms = ['General'];

app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
    socket.emit('roomList', rooms);

    socket.on('joinRoom', (room) => {
        socket.join(room);
    });

    socket.on('chatMessage', (data) => {
        io.to(data.room).emit('message', { room: data.room, message: data.message });
    });

    socket.on('createRoom', (room) => {
        if (!rooms.includes(room)) {
            rooms.push(room);
            io.emit('roomList', rooms);
        }
    });
});

server.listen(3000, () => console.log('Server running on port 3000'));
