

module.exports = (socket, users, io) => {
    console.log('stranger sockets');
    socket.join(socket.id);
    socket.on('connectingStrangerChatbox', ({interest}) => {
        users.push({id: socket.id, interest, connectedTo : null, ready: false});
        io.emit('updateUsers', {users});
    });

    socket.on('updateUsers', data => {
        users = data.users;
        console.log(users);
    });


    socket.on('findStranger', () => {
        const currentUser = users.filter(user => user.id === socket.id)[0];
        if(currentUser.connectedTo === null){
            users = users.map(user => {
                if(user.id === socket.id){
                    user.connectedTo = 'available';
                }
                return user;
            });
            let sameInterestUser;
            if(currentUser.interest[0] === ''){
                sameInterestUser = users.filter(user => user.id !== socket.id && user.connectedTo === 'available');

            }else{
                sameInterestUser = users.filter(user => user.interest.some(interest => currentUser.interest.includes(interest)) && user.id !== socket.id && user.connectedTo === 'available');

            }
            // console.log(sameInterestUser);
            let random = Math.floor(Math.random() * sameInterestUser.length);
            const stranger = sameInterestUser[random];
            if(stranger !== undefined){
                users = users.map(user => {
                    if(user.id === socket.id){
                        user.connectedTo = stranger.id;
                        user.ready = true;
                    }
                    if(user.id === stranger.id){
                        user.connectedTo = socket.id;
                    }
                    return user;
                });
                io.emit('updateUsers', {users});
                socket.emit('findStranger',users)
            }else{
                socket.emit('findStranger',false)

            }
            
        }
        
        
    });

    socket.on('endStrangerConnection', () => {
        // const currentUser = users.filter(user => user.id === socket.id)[0];
        
        // const stranger = users.filter(user => user.id === currentUser.connectedTo)[0];
        // console.log(stranger);
        // users = users.map(user => {
        //     if(user.id === currentUser.id){
        //         user.connectedTo = null;
        //         user.ready = false;
        //     }
        //     if(user.id === stranger.id){
        //         user.connectedTo = null;
        //         user.ready = false;
        //     }
        //     return user
        // });
        console.log(users);
        // socket.to(stranger.id).emit('endStrangerConnection');
        // socket.emit('endStrangerConnection');
    });

    socket.on('checkUserIfReady', () => {
        const currentUser = users.filter(user => user.id === socket.id)[0];
        const stranger = users.filter(user => user.id == currentUser.connectedTo)[0];
        if(!stranger.ready){
            users = users.map(user => {
                if(user.id === stranger.id){
    
                    user.ready = true;
                }
                return user;
            });
            io.emit('updateUsers', {users});
            socket.to(stranger.id).emit('matchComplete',socket.id);
        }
        
        if(currentUser.ready && stranger.ready){
            socket.emit('checkUserIfReady', stranger.id);
        }else{
            socket.emit('checkUserIfReady', false);
        }
        

        
    })

    socket.on('disconnectingStrangerChatbox', ()=>{
        users = users.filter(user => user.id !== socket.id);
    })
}