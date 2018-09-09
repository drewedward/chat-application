//TODOS: Add randomizer for user profile (handle name, user text user)
var generatedName = '_' + Math.random().toString(36).substr(2, 9);

//TODOS: Create event to end typing message if user deletes their message

//TODOS: Create event to show when someone joins the chat

//TODOS: Create Active Members panel

//TODOS: Create Current User panel

//TODOS: Persist messages for clients logging into chat session

// Make connection and create a socket unique to client
// We have io library due to CDN reference in index.html
// This connection hits server at the specified port and receives information about the unique socket created for the client
var socket = io.connect('http://localhost:4000');

// Query DOM
var message = document.getElementById('message'),
    userName = document.getElementById('userName'),
    btn = document.getElementById('send'),
    output = document.getElementById('output'),
    feedback = document.getElementById('feedback');

// Set username
userName.value = generatedName;

// Emit events
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
        if (data.userName === generatedName){
            return { containerType: 'darker' }
        }

        return { containerType: 'lighter' }
    }();

    output.innerHTML += '<div class="chat-container ' + chatContainerSettings.containerType + '">' +
                        '<span class="chat-username">' + data.userName + '</span>' +
                        '<span class="chat-datestamp">' + data.date + '</span>' +
                        '<p class="chat-message">' + data.message + '</p>'
});

// typing handler
socket.on('typing', function(data){
    feedback.innerHTML = '<p><em>' + data.userName + ' is typing...</em></p>';
});
