const User = require('../models/users');

module.exports = (socket, io) => {
    console.log('stranger sockets');
    socket.join(socket.id);
    socket.on('connectingStrangerChatbox', ({interest}) => {
        User.create({_id : socket.id, interest});
    });

    socket.on('sendMessageToStranger', ({message, sendTo}) => {
        socket.to(sendTo).emit('sendMessageToStranger', {sender: socket.id, message});
        socket.emit('sendMessageToStranger', {sender: socket.id, message});
    });

    socket.on('findStranger', () => {
        User.findOne({_id : socket.id})
            .then(user => {
                if(user.connectedTo === 'null'){
                    user.connectedTo = 'available';
                }
                
                user.save()
                    .then(user => {
                        let currentUser = user;
                        User.find()
                            .then(users => {
                                let sameInterestUser;
                                if(user.interest[0] === ''){
                                    sameInterestUser = users.filter(user => user.id !== socket.id && user.connectedTo === 'available');
                                }else{
                                    sameInterestUser = users.filter(user => user.interest.some(interest => currentUser.interest.includes(interest)) && user.id !== socket.id && user.connectedTo === 'available');
                                }
                                let random = Math.floor(Math.random() * sameInterestUser.length);
                                const stranger = sameInterestUser[random];
                                if(stranger !== undefined){
                                    User.findById(socket.id)
                                        .then(user => {
                                            user.connectedTo = stranger._id;
                                            user.ready = true;
                                            user.save()
                                                .then(user => {
                                                    User.findById(stranger._id)
                                                        .then(user => {
                                                            user.connectedTo = socket.id;
                                                            user.save()
                                                                .then(user => {
                                                                    io.emit('updateUsers', {users});
                                                                    socket.emit('findStranger',users)
                                                                })
                                                        })
                                                })
                                        })
                                }else{
                                    socket.emit('findStranger',false)
                                }  
                            })
                    })
            })
    })

    socket.on('endStrangerConnection', () => {
        User.find()
            .then(users => {
                const currentUser = users.filter(user => user._id === socket.id)[0];
                const stranger = users.filter(user => user._id === currentUser.connectedTo)[0];
                User.findById(currentUser._id)
                    .then(user => {
                        user.connectedTo = 'null';
                        user.ready = false;
                        user.save()
                            .then(() => {
                                if(stranger !== undefined){
                                    User.findById(stranger._id)
                                        .then(user => {
                                            user.connectedTo = 'null';
                                            user.ready = false;
                                            user.save()
                                                .then(() => {
                                                    socket.to(stranger._id).emit('endStrangerConnection');
                                                    socket.emit('endStrangerConnection');
                                                    User.find()
                                                        .then(users => {
                                                            console.log(users);
                                                        })
                                                })
                                        }) 
                                }
                            })
                    })
            })
        
    });

    socket.on('sample',()=>{
        console.log('samlpe');
    })

    socket.on('checkUserIfReady', () => {
        User.find()
        .then(users => {
            const currentUser = users.filter(user => user._id === socket.id)[0];
            const stranger = users.filter(user => user._id == currentUser.connectedTo)[0];
            if(!stranger.ready){
                User.findById(stranger._id)
                    .then(user => {
                        user.ready = true;
                        user.save()
                            .then(() => {
                                io.emit('updateUsers', {users});
                                socket.to(stranger._id).emit('matchComplete',socket.id);

                            })
                    })
                
            }
            if(currentUser.ready && stranger.ready){
                socket.emit('checkUserIfReady', stranger._id);
            }else{
                socket.emit('checkUserIfReady', false);
            }
        })

    });

    socket.on('disconnectingStrangerChatbox', ()=>{
    })
}