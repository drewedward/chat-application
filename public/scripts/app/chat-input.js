define(['socketConnection', 'user'], function(socketConnection, user){
    var submitBtn = document.getElementById('send');
    var chatMessage = document.getElementById('message');

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

    submitBtn.addEventListener('click', function(){
        submitMessage();
    });

    chatMessage.addEventListener('keyup', function(event){
        if (event.key === 'Enter'){
            submitMessage();
        }
    });

    var submitMessage = function(){
        // arg 1: name of variable that we are sending
        // arg 2: the data we are sending
        socketConnection.socket.emit('chat', {
            // message info
            message: chatMessage.value,
            date: new Date(),

            // username info
            userName: user.userName
        });

        chatMessage.value = '';
    }
});
