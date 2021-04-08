require('dotenv/config');
const express = require('express');
const staticMiddleware = require('./static-middleware');

const app = express();

app.use(staticMiddleware);

const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.on('connection', socket => {
  console.log('connected!');
  console.log('ROOOOOOOOOMS ! ! ! !', socket.rooms);
  socket.on('newRoom', room => {
    console.log('room', room);
  });
});

server.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`http server listening on port ${process.env.PORT}`);
});
