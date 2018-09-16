define(['moment', 'user', 'socketConnection'], function(moment, user, socketConnection){
    //TODOS: Create event to handle multiple people typing at once

    //TODOS: Persist messages for clients logging into chat session

    // Module Order: 
    // 1. DOM Module
    // 2. User Module
    // 3. Socket Module
    // 4. DOM Event Module

    // or should it be more 
    // Login Module - generate user, establish connections + display active users
    // Feedback Module - controls feedback dom element to display concurrent active events
    // Messaging Module - controls messaging display

    // DOM Module
    var message = document.getElementById('message'),
        btn = document.getElementById('send'),
        output = document.getElementById('output'),
        feedback = document.getElementById('feedback'),
        activeUsersList = document.getElementById('active-users-list');

    // Socket Module
    // Dependencies: DOM Module, User Module 
    // Should it just be responsible for
    // 1. connecting to the socket
    // 2. associating callbacks to specific socket events?


    // Listen for events for client's socket
    // chat handler
    socketConnection.socket.on('chat', function(data){
        feedback.innerHTML = '';

        var chatContainerSettings = function(){
            // should this be identfying by socket id rather than userName in case duplicate userNames?
            if (data.userName === user.userName){
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
    socketConnection.socket.on('typing', function(data){
        feedback.innerHTML = '<p><em>' + data.userName + ' is typing...</em></p>';
    });

    // stopped typing handler
    socketConnection.socket.on('stoppedTyping', function(){
        feedback.innerHTML = '';
    });

    // connected user handler
    socketConnection.socket.on('connectedUser', function(data){
        output.innerHTML += '<p class="chat-new-user"><em>' + data.userName + ' has joined the chat</em></p>';
        updateActiveUsersList(data.activeUsers);
    });

    // disconnect handler
    socketConnection.socket.on('disconnectedUser', function(data){
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

    // DOM Event Handlers
    // Dependencies: DOM Module, Socket Module
    // Emit events based on user input
    btn.addEventListener('click', function(){
        submitMessage();
    });

    var timer = null;
    message.addEventListener('keypress', function(){
        clearTimeout(timer);

        timer = setTimeout(function(){
            socketConnection.socket.emit('stoppedTyping');
        }, 5000);

        socketConnection.socket.emit('typing', {
            // message info
            message: 'typing...',

            // user info
            userName: user.userName
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
        socketConnection.socket.emit('chat', {
            // message info
            message: message.value,
            date: new Date(),

            // username info
            userName: user.userName
        });

        message.value = '';
    }
});
