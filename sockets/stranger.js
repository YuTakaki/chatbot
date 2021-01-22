module.exports = (socket, users) => {
    console.log('stranger sockets');
    socket.on('connectingStrangerChatbox', interests => {
        users.push(socket.id);
        console.log(users);
    })
}