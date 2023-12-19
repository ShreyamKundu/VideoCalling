const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const { v4: uuidv4 } = require('uuid');
const { ExpressPeerServer } = require('peer');
const peerserver = ExpressPeerServer(server,{
  debug: true
});

// Templating Engine
app.set('view engine','ejs');
app.set('views','views');


// For static files
app.use(express.static('public'));

app.use('/peerjs',peerserver);
app.get('/', (req, res) => {
    res.redirect(`/${uuidv4()}`);
  });

app.get('/:roomId', (req, res) => {
    res.render('room', {roomId : req.params.roomId});
  });

io.on('connection', (socket) => {
    socket.on('join-room', (roomId,userId) => {
      socket.join(roomId); //Joined the specific room
      socket.broadcast.to(roomId).emit('user-connected',userId);
      socket.on('message', msg => {
        io.to(roomId).emit('createmessage',msg);
      })
    })
  });




const PORT = 3000;
server.listen(PORT,console.log(`Server is listening on ${PORT}`))