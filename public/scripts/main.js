// require js config
requirejs.config({
    baseUrl: 'scripts',
    paths: {
        chat: 'app/chat'
    }
});

// main app logic
requirejs(['chat']);
