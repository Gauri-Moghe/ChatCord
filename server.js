const path  = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//set static folder for frontend
app.use(express.static(path.join(__dirname, 'public')));

//Run when the client connects
io.on('connection', socket => {
    console.log('New WS Connection...');

    socket.emit('message', 'Welcome to ChatCord!');

    //Broadcast when a user connects
    socket.broadcast.emit('message', 'A user has joined the chat');

    //this code runs when client disconnects

});


const PORT = 3000 || process.env.PORT ;

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

