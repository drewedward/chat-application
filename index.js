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

// listen for an event called connection (invoked by client side browser). 
// once a connection is triggered, generate a socket unique to client and configure it with listener events
io.on('connection', function(clientSocket){
    console.log('made socket connection', clientSocket.id);

    // listen for the 'chat' subject
    clientSocket.on('chat', function(data){
        // access sockets collection for all sockets on the server
        // publish data for 'chat' subject
        io.sockets.emit('chat', data);
    });

    // listen for 'typing' subject
    clientSocket.on('typing', function(data){
        // use the client-specific socket to emit to every other client except the current one
        clientSocket.broadcast.emit('typing', data);
    });
}) 
