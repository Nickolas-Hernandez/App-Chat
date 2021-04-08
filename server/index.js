require('dotenv/config');
const express = require('express');
const staticMiddleware = require('./static-middleware');

const app = express();
const jsonMiddleware = express.json();

app.use(staticMiddleware);
app.use(jsonMiddleware);

const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.on('connection', socket => {
  console.log('connected!');
  socket.on('getTimer', interval => {
    setInterval(() => {
      socket.emit('timer:', new Date());
    }, interval);
  });
});

io.on('disconnect', () => {
  console.log('user disconnected');
});

app.post('/api/newRoom', (req, res, next) => {
  const { chatName, userName } = req.body;
  console.log(req.body);
});

server.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`http server listening on port ${process.env.PORT}`);
});
