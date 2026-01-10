const path  = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages')
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//set static folder for frontend
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'ChatCord Bot'; //bot name

//Run when the client connects
io.on('connection', socket => {


    socket.on ('joinRoom', ({username, room}) => { 

        //taking username and room details from the url to join the room
        const user = userJoin(socket.id, username, room);

        socket.join(user.room)

        //Welcoming the current user
        socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));

        //Broadcast when a user connects
        socket.broadcast.to(user.room).emit( //emitting message to a particular room
            'message', 
            formatMessage(botName, `${user.username} has joined the chat`)
        );

        //sending the room and users info
        io.to(user.room).emit('roomUsers', {
            room : user.room,
            users : getRoomUsers(user.room)
        });

    });


    //Listening for the chat message
    socket.on('chatMessage', msg => { 
        const user = getCurrentUser(socket.id);
        // console.log(msg);
        io.to(user.room).emit('message', formatMessage(user.username, msg));

    });

        //this code runs when client disconnects
    socket.on('disconnect', () => {

        const user = userLeave(socket.id);

        if(user) //if the user exists then you want to remove it and say bye
        {
            io.to(user.room).emit(
                'message', formatMessage(botName,`${user.username} has left the chat`)
            );

            //sending the room and users info
            io.to(user.room).emit('roomUsers', {
                room : user.room,
                users : getRoomUsers(user.room)
            });
        }
        
    });

});


const PORT = 3000 || process.env.PORT ;

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

