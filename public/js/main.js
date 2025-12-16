const socket = io(); //connects to server

//Listen for messages from server
socket.on('message', message => {
    console.log(message);
});