const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let users = [];  // Array para rastrear os usuários conectados

// Servir o arquivo HTML estático
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Configuração do Socket.IO para tratar os eventos de conexão, mensagem e desconexão
io.on('connection', (socket) => {
  console.log('Um usuário se conectou: ' + socket.id);

  // Adiciona o usuário à lista e envia a contagem de usuários online
  users.push(socket.id);
  io.emit('users online', users.length);

  // Notifica todos os outros usuários sobre a nova conexão
  socket.broadcast.emit('message', 'Um novo usuário entrou no chat');

  // Lida com o evento de mensagem enviada pelo usuário
  socket.on('chat message', (msg) => {
    io.emit('message', msg);  // Envia a mensagem para todos os clientes conectados
  });

  // Lida com o evento de desconexão
  socket.on('disconnect', () => {
    console.log('Um usuário se desconectou: ' + socket.id);
    users = users.filter(user => user !== socket.id);  // Remove o usuário da lista

    // Notifica todos os outros usuários sobre a desconexão
    socket.broadcast.emit('message', 'Um usuário saiu do chat');
    
    // Atualiza a contagem de usuários online
    io.emit('users online', users.length);
  });
});

// Inicializa o servidor na porta 3000
server.listen(3000, () => {
  console.log('Listening on *:3000');
});
