const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let users = []

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


io.on('connection', (socket) => {
    console.log('A user connected: ' + socket.id);
  
    // Adiciona o usuário à lista de online
    users.push(socket.id);
  
    // Broadcast para todos os outros que um usuário entrou
    socket.broadcast.emit('message', 'A new user has joined the chat');

    // Envia a quantidade de usuários online para todos
    io.emit('users online', users.length);
  
    // Evento de desconexão
    socket.on('disconnect', () => {
      console.log('A user disconnected: ' + socket.id);
  
      // Remove o usuário da lista
      users = users.filter(user => user !== socket.id);
  
      // Broadcast para todos os outros que o usuário saiu
      socket.broadcast.emit('message', 'A user has left the chat');
  
      // Envia a quantidade de usuários online atualizada
      io.emit('users online', users.length);
    });
  });
  
// io.on('connection', (socket) => {
//     console.log('a user connected');
    
//     // Lidar com a mensagem de chat enviada pelo cliente
//     socket.on('chat message', (msg) => {
//       console.log('message: ' + msg);
//     });

//     socket.on('chat message', (msg)=> { 
//         io.emit('chat message', msg)
//     })
    
    
//     // Lidar com a desconexão do cliente
//     socket.on('disconnect', () => {
//       console.log('user disconnected');
//     });
// });

server.listen(3000, () => {
  console.log('listening on *:3000');
});