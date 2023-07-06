const http = require('http')

const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const PORT = process.env.PORT || 8080

const Message = require('./utils/Message.js')
const UsersHandler = require('./utils/UsersHandler.js')

const usersHandler = new UsersHandler()

app.use(express.static('public'))

// when someone connects
io.on('connection', (socket) =>{

    socket.on('joinRoom', (data) =>{

        const user = usersHandler.userJoin(socket.id, data.username, data.room)

        socket.join(user.room)

        socket.emit('dev', 'Hello!');

        socket.broadcast.to(user.room).emit('message', new Message('Server', `${data.username} has connected!`))

        io.to(user.room).emit('userCount', usersHandler.getRoomUsers(user.room).length)
        io.to(socket.id).emit('individualUserCount', usersHandler.getRoomUsers(user.room).length)
        
    })

    socket.on('disconnect', () => {
        const user = usersHandler.userLeave(socket.id)

        if(user){
            io.to(user.room).emit('message', new Message('Server', `${user.username} has disconnected!`))
            io.to(user.room).emit('userCount', usersHandler.getRoomUsers(user.room).length)
        }

    })

    socket.on('message', (message) => {
        const user = usersHandler.getCurrentUser(socket.id)

        io.to(user.room).emit('message', new Message(user.username, message))
    })

    socket.on('randomNumber', () => {
        const user = usersHandler.getCurrentUser(socket.id)

        const randomNumber = generateRandomInt(0, 11)

        io.to(user.room).emit('message', new Message('Server', `${user.username} asked for a random number. The number is: ${randomNumber}`))
    })

    socket.on('opponentWon', () => {
        const user = usersHandler.getCurrentUser(socket.id)

        socket.broadcast.to(user.room).emit('checkVictory')
    })

    socket.on('confirmVictory', () => {
        const user = usersHandler.getCurrentUser(socket.id)

        socket.broadcast.to(user.room).emit('youWon')
        io.to(socket.id).emit('youLost')
    })
})

server.listen(PORT, () => {
    console.log(`Live on port ${PORT}`)
})


// the maximum is exclusive and the minimum is inclusive
function generateRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }