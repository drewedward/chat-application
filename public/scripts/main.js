// require js config
requirejs.config({
    baseUrl: 'scripts',
    paths: {
        socketio: 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.1.1/socket.io',
        moment: 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min',
        user: 'app/user',
        socketConnection: 'app/socket-connection',
        activeUsers: 'app/active-users',
        chatInput: 'app/chat-input',
        chatOutput: 'app/chat-output'
    }
});

// main app logic
requirejs(['user', 'socketConnection', 'activeUsers', 'chatInput', 'chatOutput'], function(){
    // TODO: Lazy loading to prevent modules to load until user is verified
    // TODO: Provide a sign in page to allow user to select or generate random name
    console.log('app is loaded!')
});
