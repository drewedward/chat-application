var express = require('express');
var socket = require('socket.io');

// App setup
var app = express();
var server = app.listen(4000, function() {
    console.log('listening to requests on port 4000');
}); // setup our express server

// Static files
app.use(express.static('public')); // serve static files

// Socket setup
var io = socket(server); // bind to our server

// Create array to hold active users
var activeUsers = [];
var connectedSockets = {};

// listen for an event called connection (invoked by client side browser). 
// once a connection is triggered, generate a socket unique to client and configure it with listener events
io.on('connection', function(clientSocket){
    // only occurs once on connection
    console.log('made socket connection for', clientSocket.id);

    // registers the new socket for 'connectedUser' subject
    clientSocket.on('connectedUser', function(data){
        // establish user name to socket id relationship on server side
        connectedSockets[clientSocket.id] = data.userName;

        // push username to an active users array for client side read purposes
        data.activeUsers = activeUsers.push(data.userName);

        console.log(connectedSockets);
        console.log(activeUsers);
        console.log('registered ' + data.userName + ' to socket id ' + clientSocket.id);

        clientSocket.broadcast.emit('connectedUser', { userName: data.userName, activeUsers: activeUsers });
    })

    // registers the new socket for 'disconnect' subject
    clientSocket.on('disconnect', function(){
        // retrieve username of disconnected socket id
        var userName = connectedSockets[clientSocket.id];

        // remove socket id from connected sockets object
        delete connectedSockets[clientSocket.id];

        // remove username from active users array
        var userNameIndex = activeUsers.indexOf(userName);
        if (userNameIndex > -1){
            activeUsers.splice(userNameIndex, 1);
        };

        console.log(connectedSockets);
        console.log(activeUsers);
        console.log('un-registered ' + userName + ' and removed socket id ' + clientSocket.id);

        clientSocket.broadcast.emit('disconnectedUser', { disconnectedUserName: userName, activeUsers: activeUsers });
    });

    // registers the new socket for 'chat' subject
    clientSocket.on('chat', function(data){
        io.sockets.emit('chat', data); // access sockets collection for all sockets on the server
    });

    // registers the new socket for 'typing' subject
    clientSocket.on('typing', function(data){
        clientSocket.broadcast.emit('typing', data); // use the client-specific socket to emit to every other client except the current one
    });
}) 
