const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {
    socket.on('send-location', (data) => {
        io.emit('receive-location', { id: socket.id, ...data });
    });

    socket.on('disconnect', () => {
        io.emit('user-disconnected', socket.id);
    });
});

app.get("/", (req, res) => {
    res.render("index");
});

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

server.listen(7000, () => {
    console.log(`Server running at http://localhost:7000`);
});