const path  = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//set static folder for frontend
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ChatCord Bot'; //bot name

//Run when the client connects
io.on('connection', socket => {

    // console.log('New WS Connection...');

    //Welcoming the current user
    socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));

    //Broadcast when a user connects
    socket.broadcast.emit('message', formatMessage(botName,'A user has joined the chat'));

    //this code runs when client disconnects
    socket.on('disconnect', () => {
        io.emit('message', formatMessage(botName,'A user has left the chat'));

    });

    //Listening for the chat message
    socket.on('chatMessage', msg => {
        // console.log(msg);
        io.emit('message', formatMessage('USER', msg));
    });

});


const PORT = 3000 || process.env.PORT ;

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

