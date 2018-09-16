define(['socketConnection', 'user', 'moment'], function(socketConnection, user, moment){
    var output = document.getElementById('output'),
        feedback = document.getElementById('feedback')

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

        output.innerHTML += '<div class="chat-container ' + chatContainerSettings.containerType + '">' +
                            '<span class="chat-username">' + data.userName + '</span>' +
                            '<span class="chat-datestamp">' + moment(data.date).calendar() + '</span>' +
                            '<p class="chat-message">' + data.message + '</p>'
    });
});
