//TODOS: Create event to handle multiple people typing at once

//TODOS: Persist messages for clients logging into chat session

var userName = '_' + Math.random().toString(36).substr(2, 9);

// Query DOM
var message = document.getElementById('message'),
    btn = document.getElementById('send'),
    output = document.getElementById('output'),
    feedback = document.getElementById('feedback'),
    currentUserMessage = document.getElementById('current-user-message'),
    activeUsersList = document.getElementById('active-users-list');

currentUserMessage.innerText = 'Signed in as ' + userName + '!';

// Make connection and create a socket unique to client
// We have io library due to CDN reference in index.html
// This connection hits server at the specified port and receives information about the unique socket created for the client
var socket = io.connect('http://localhost:4000');

// Emits initial event to establish a new connection was made
socket.emit('connectedUser', {
    date: new Date(),
    userName: userName
});

// Emit events based on user input
btn.addEventListener('click', function(){
    submitMessage();
});

var timer = null;
message.addEventListener('keypress', function(){
    clearTimeout(timer);

    timer = setTimeout(function(){
        socket.emit('stoppedTyping');
    }, 5000);

    socket.emit('typing', {
        // message info
        message: 'typing...',

        // user info
        userName: userName
    });
});

message.addEventListener('keyup', function(event){
    if (event.key === 'Enter'){
        submitMessage();
    }
});

var submitMessage = function(){
    // arg 1: name of variable that we are sending
    // arg 2: the data we are sending
    socket.emit('chat', {
        // message info
        message: message.value,
        date: new Date(),

        // username info
        userName: userName
    });

    message.value = '';
}

// Listen for events for client's socket
// chat handler
socket.on('chat', function(data){
    feedback.innerHTML = '';

    var chatContainerSettings = function(){
        // should this be identfying by socket id rather than userName in case duplicate userNames?
        if (data.userName === userName){
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

// stopped typing handler
socket.on('stoppedTyping', function(){
    feedback.innerHTML = '';
});

// connected user handler
socket.on('connectedUser', function(data){
    output.innerHTML += '<p class="chat-new-user"><em>' + data.userName + ' has joined the chat</em></p>';
    updateActiveUsersList(data.activeUsers);
});

// disconnect handler
socket.on('disconnectedUser', function(data){
    output.innerHTML += '<p class="chat-new-user"><em>' + data.disconnectedUserName + ' has left the chat</em></p>';
    updateActiveUsersList(data.activeUsers);
});

updateActiveUsersList = function(activeUsers){
    activeUsersList.innerHTML = '';

    for(var i = 0; i < activeUsers.length; i++){
        var li = document.createElement('li');
        li.innerHTML += activeUsers[i] + '<span class="dot"></span>';

        activeUsersList.appendChild(li);
    }
}
