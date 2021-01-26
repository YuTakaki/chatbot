const findRoom = (id, user) => {
    console.log(user.filter(user => user.id === id)[0])
    return user.filter(user => user.id === id)[0].group;
    
}

const allUsers = (room, user) => {
    return user.filter(user=> user.group === room);
}


module.exports = (socket, user, io) => {
    socket.on('joinGroupChatbox', data => {
        socket.join(data.groupName);
        const checkUser = user.some(user => user.id === socket.id);
        if(!checkUser){
            user.push({id: socket.id, username : data.username, group : data.groupName});
        }else{
            user = user.map(user => {
                if(user.id === socket.id){
                    user.group = data.groupName;
                }
                return user
            })
        }
        console.log(user)
        
        

        socket.on('sendMessage', data => {
            const room = findRoom(socket.id, user);
            io.in(room).emit('sending', data);
           
        });

        socket.on('getUsers', room => {
            io.in(room).emit('users', allUsers(room, user).filter(user => user.id !== socket.id));
        })
    });
    
    socket.on('disconnectGroupchatRoom', room => {
        socket.leave(room);
        io.in(room).emit('users', allUsers(room, user).filter(user => user.id !== socket.id));
    })
    
}