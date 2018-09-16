define(['socketio', 'user'], function(io, user){
    var socketConnection = {};

    // Make connection and create a socket unique to client
    // This connection hits server at the specified port and receives information about the unique socket created for the client
    socketConnection.socket = io.connect('http://localhost:4000');

    // Emits initial event to establish a new connection was made
    socketConnection.socket.emit('connectedUser', {
        date: new Date(),
        userName: user.userName
    });

    return socketConnection;
});
