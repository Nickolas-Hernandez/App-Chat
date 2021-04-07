const httpServer = require('http').createServer();
const io = require('socket.io')(httpServer);

console.log('server here!!!', io);

require('dotenv/config');
const express = require('express');
const staticMiddleware = require('./static-middleware');

const app = express();

app.use(staticMiddleware);

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`express server listening on port ${process.env.PORT}`);
});
