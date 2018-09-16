// require js config
requirejs.config({
    baseUrl: 'scripts',
    paths: {
        socketio: 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.1.1/socket.io',
        moment: 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min',
        user: 'app/user',
        socketConnection: 'app/socket-connection',
        activeUsers: 'app/active-users',
        chat: 'app/chat'
    }
});

// main app logic
// 1. User sign in
// 2. Establish socket connection
// 3. Register active-users, chat-messages, chat-feedback, chat-submit
requirejs(['chat', 'activeUsers']);
