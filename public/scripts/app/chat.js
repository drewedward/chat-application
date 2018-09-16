define(['moment', 'user', 'socketConnection'], function(moment, user, socketConnection){
    //TODOS: Create event to handle multiple people typing at once

    //TODOS: Persist messages for clients logging into chat session

    var output = document.getElementById('output'),
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
});
