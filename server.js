const express = require('express');
const socket = require('socket.io')

const app = express()

const port = process.env.PORT || 8000

app.use('/sample', require('./routes/sample'))
const server = app.listen(port, () => {
        console.log(`listening to port ${port}`)
    });

const io = socket(server);
let stranger_chatbox_users = [];
let group_chatbox_users = [];
io.sockets.on('connection', socket => {
    require('./sockets/stranger')(socket, stranger_chatbox_users, io);
    require('./sockets/groupchat')(socket, group_chatbox_users, io);
    socket.on('disconnect', () => {
        stranger_chatbox_users = stranger_chatbox_users.filter(user => user.id !== socket.id);
        group_chatbox_users = group_chatbox_users.filter(user => user.id !== socket.id);
        console.log(stranger_chatbox_users);
        socket.leave(socket.id);
    })
})