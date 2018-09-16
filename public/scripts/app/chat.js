define(['moment', 'user', 'socketConnection'], function(moment, user, socketConnection){
    //TODOS: Create event to handle multiple people typing at once

    //TODOS: Persist messages for clients logging into chat session
    
    var message = document.getElementById('message'),
        btn = document.getElementById('send'),
        output = document.getElementById('output'),
        feedback = document.getElementById('feedback')
    
    // Chat Messages Module
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

    // Chat Feedback Module
    // typing handler
    socketConnection.socket.on('typing', function(data){
        feedback.innerHTML = '<p><em>' + data.userName + ' is typing...</em></p>';
    });

    // stopped typing handler
    socketConnection.socket.on('stoppedTyping', function(){
        feedback.innerHTML = '';
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

    // Chat Submit Module
    btn.addEventListener('click', function(){
        submitMessage();
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
