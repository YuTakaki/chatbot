const express = require('express');
const socket = require('socket.io')

const app = express()

const port = process.env.PORT || 8000

app.use('/sample', require('./routes/sample'))
const server = app.listen(port, () => {
        console.log(`listening to port ${port}`)
    });

const io = socket(server);
const users = []
io.sockets.on('connection', socket => {
    require('./sockets/stranger')(socket, users)

    socket.on('disconnect', () => {
        console.log('disconnected');
    })
})