
const chatForm = document.getElementById('chat-form');
chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');


//get username and room from URL
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io(); //connects to server

//joining the chatroom
socket.emit('joinRoom', {username, room});

//Getting the room and user
socket.on('roomUsers', ({room, users}) =>{
    outputRoomName(room);
    outputUsers(users);
});

//Listen for messages from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    //everytime a message is sent scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
    

});

//Event listner for submitting a message 
chatForm.addEventListener('submit', (e) => {

    //prevent the default behavior of submitting the form to a file
    e.preventDefault();


    //getting the text message 
    //e.target-> element triggering the eveny

    const msg = e.target.elements.msg.value;
    
    // console.log(msg);
    //Emitting message to the server
    socket.emit('chatMessage', msg);

    //clearing the input after sending the message
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();

});

//output message to DOM
function outputMessage(message) {

    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
						<p class="text">
							${message.text}
						</p>`;
    
    document.querySelector('.chat-messages').appendChild(div);

}


//adding the roomname to the DOM
function outputRoomName(room){
    roomName.innerText = room;
}

//Adding users to the DOM
function outputUsers(users){
    userList.innerHTML = `
        ${users.map(user=> `<li>${user.username}</li>`).join('')}
    `;
}