define([], function(){
    var user = {};

    var currentUserMessage = document.getElementById('current-user-message');
    var userName = '_' + Math.random().toString(36).substr(2, 9);
    currentUserMessage.innerText = 'Signed in as ' + userName + '!';

    user.userName = userName;

    return user;
});
