//TODOS: Create event to end typing message if user deletes their message

//TODOS: Create Active Members panel

//TODOS: Create Current User panel

//TODOS: Persist messages for clients logging into chat session

// Query DOM
var message = document.getElementById('message'),
    userName = document.getElementById('userName'),
    btn = document.getElementById('send'),
    output = document.getElementById('output'),
    feedback = document.getElementById('feedback');

// Set username
userName.value = '_' + Math.random().toString(36).substr(2, 9);;

// Make connection and create a socket unique to client
// We have io library due to CDN reference in index.html
// This connection hits server at the specified port and receives information about the unique socket created for the client
var socket = io.connect('http://localhost:4000');

// Emits initial event to establish a new connection was made
socket.emit('connectedUser', {
    date: new Date(),
    userName: userName.value
});

// Emit events based on user input
btn.addEventListener('click', function(){
    console.log('sending chat message for ' + socket.id);
    // arg 1: name of variable that we are sending
    // arg 2: the data we are sending
    socket.emit('chat', {
        // message info
        message: message.value,
        date: new Date(),

        // username info
        userName: userName.value
    })
});

message.addEventListener('keypress', function(){
    socket.emit('typing', {
        // message info
        message: 'typing...',

        // user info
        userName: userName.value
    })
});

// Listen for events for client's socket
// chat handler
socket.on('chat', function(data){
    console.log('receiving chat message from ' + data.userName);

    feedback.innerHTML = '';

    var chatContainerSettings = function(){
        if (data.userName === userName.value){
            return { containerType: 'darker' }
        }

        return { containerType: 'lighter' }
    }();

    // Dependency on moment.js
    output.innerHTML += '<div class="chat-container ' + chatContainerSettings.containerType + '">' +
                        '<span class="chat-username">' + data.userName + '</span>' +
                        '<span class="chat-datestamp">' + moment(data.date).calendar() + '</span>' +
                        '<p class="chat-message">' + data.message + '</p>'
});

// typing handler
socket.on('typing', function(data){
    feedback.innerHTML = '<p><em>' + data.userName + ' is typing...</em></p>';
});

// connected user handler
socket.on('connectedUser', function(data){
    console.log(data.activeUsers);
    output.innerHTML += '<p class="chat-new-user"><em>' + data.userName + ' has joined the chat</em></p>';
});

// disconnect handler
socket.on('disconnectedUser', function(data){
    console.log(data.activeUsers);
    output.innerHTML += '<p class="chat-new-user"><em>' + data.disconnectedUserName + ' has left the chat</em></p>';
});
