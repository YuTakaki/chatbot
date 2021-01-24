module.exports = (socket, user) => {
    console.log(socket.id);
    socket.on('joinGroupChatbox', data => {
        socket.join(data.groupName);
        user.push({id: socket.id, name : data.name, group : data.groupName});
        console.log(user);
    });
    
}