module.exports = (socket, users) => {
    console.log('stranger sockets');
    socket.on('connectingStrangerChatbox', ({interest}) => {
        users.push({id: socket.id, interest, connectedTo : null});
        console.log(users);
    });

    socket.on('findStranger', () => {
        const currentUser = users.filter(user => user.id === socket.id)[0];
        const sameInterestUser = users.filter(user => user.interest.some(interest => currentUser.interest.includes(interest)) && user.id !== socket.id);
        console.log(sameInterestUser);

    })

    socket.on('disconnectingStrangerChatbox', ()=>{
        users = users.filter(user => user.id !== socket.id);
    })
}