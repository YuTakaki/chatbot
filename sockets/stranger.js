module.exports = (socket, users) => {
    console.log('stranger sockets');
    socket.on('connectingStrangerChatbox', ({interest}) => {
        users.push({id: socket.id, interest});
        console.log(users);
    });

    socket.on('disconnectingStrangerChatbox', ()=>{
        users = users.filter(user => user.id !== socket.id);
    })
}