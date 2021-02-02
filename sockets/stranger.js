const User = require('../models/users');

module.exports = (socket, io) => {
    console.log('stranger sockets');
    socket.join(socket.id);
    socket.on('connectingStrangerChatbox', ({interest}) => {
        User.create({_id : socket.id, interest});
    });

    socket.on('updateUsers', data => {
    });

    socket.on('findStranger', () => {
        User.findOne({_id : socket.id})
            .then(user => {
                if(user.connectedTo === null){
                    user.connectedTo = 'available';
                }
                user.save()
                    .then(user => {
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
                                            user.connectedTo = stranger.id;
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


    // socket.on('findStranger', () => {
    //     const currentUser = users.filter(user => user.id === socket.id)[0];
    //     if(currentUser.connectedTo === null){
    //         users = users.map(user => {
    //             if(user.id === socket.id){
    //                 user.connectedTo = 'available';
    //             }
    //             return user;
    //         });
    //         let sameInterestUser;
    //         if(currentUser.interest[0] === ''){
    //             sameInterestUser = users.filter(user => user.id !== socket.id && user.connectedTo === 'available');

    //         }else{
    //             sameInterestUser = users.filter(user => user.interest.some(interest => currentUser.interest.includes(interest)) && user.id !== socket.id && user.connectedTo === 'available');

    //         }
    //         // console.log(sameInterestUser);
    //         let random = Math.floor(Math.random() * sameInterestUser.length);
    //         const stranger = sameInterestUser[random];
    //         if(stranger !== undefined){
    //             users = users.map(user => {
    //                 if(user.id === socket.id){
    //                     user.connectedTo = stranger.id;
    //                     user.ready = true;
    //                 }
    //                 if(user.id === stranger.id){
    //                     user.connectedTo = socket.id;
    //                 }
    //                 return user;
    //             });
    //             io.emit('updateUsers', {users});
    //             socket.emit('findStranger',users)
    //         }else{
    //             socket.emit('findStranger',false)

    //         }
            
    //     }
        
        
    // });

    socket.on('endStrangerConnection', () => {
        User.find()
            .then(users => {
                const currentUser = users.filter(user => user._id === socket.id)[0];
                const stranger = users.filter(user => user._id === currentUser.connectedTo)[0];
                users = users.map(user => {
                    if(user.id === currentUser.id){
                        user.connectedTo = null;
                        user.ready = false;
                    }
                    if(user.id === stranger.id){
                        user.connectedTo = null;
                        user.ready = false;
                    }
                    return user
                });
                User.findById(currentUser._id)
                    .then(user => {
                        user.connectedTo = null;
                        user.ready = false;
                        user.save()
                            .then(() => {
                                User.findById(stranger._id)
                                    .then(user => {
                                        user.connectedTo = null;
                                        user.ready = false;
                                        user.save()
                                            .then(() => {
                                                socket.to(stranger.id).emit('endStrangerConnection');
                                                socket.emit('endStrangerConnection');
                                                User.find()
                                                    .then(users => {
                                                        console.log(users);
                                                    })
                                            })
                                    })
                            })
                    })
            })
        
    });

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

    // socket.on('checkUserIfReady', () => {
    //     const currentUser = users.filter(user => user.id === socket.id)[0];
    //     const stranger = users.filter(user => user.id == currentUser.connectedTo)[0];
    //     if(!stranger.ready){
    //         users = users.map(user => {
    //             if(user.id === stranger.id){
    
    //                 user.ready = true;
    //             }
    //             return user;
    //         });
    //         io.emit('updateUsers', {users});
    //         socket.to(stranger.id).emit('matchComplete',socket.id);
    //     }
        
    //     if(currentUser.ready && stranger.ready){
    //         socket.emit('checkUserIfReady', stranger.id);
    //     }else{
    //         socket.emit('checkUserIfReady', false);
    //     }
    // })

    socket.on('disconnectingStrangerChatbox', ()=>{
        User.findOneAndDelete({_id : socket.id})
        .then(user => console.log(user));
    })
}