define(['socketConnection'], function(socketConnection){
    var activeUsersList = document.getElementById('active-users-list');

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
});
