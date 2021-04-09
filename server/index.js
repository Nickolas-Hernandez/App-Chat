require('dotenv/config');
const express = require('express');
const staticMiddleware = require('./static-middleware');

const app = express();
const jsonMiddleware = express.json();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

const pg = require('pg');
const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});

app.use(staticMiddleware);
app.use(jsonMiddleware);

let sessionId;

io.on('connection', socket => {
  console.log('connected!');
  sessionId = socket.id;
});

app.get('/api/chatRooms', (req, res, next) => {
  const sql = `
    select "name" as "chatRoom,
      from "chatsRooms
  `;

});

app.post('/api/newRoom', (req, res, next) => {
  const { chatName, userName } = req.body;
  const sql = `
    insert into "chatRooms" ("name", "host", "sid")
           values ($1, $2, $3)
      returning *
  `;
  const params = [chatName, userName, sessionId];
  db.query(sql, params)
    .then(result => {
      const chatRoom = result.rows[0];
      res.status(201).json(chatRoom);
    })
    .catch(err => next(err));
});

server.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`http server listening on port ${process.env.PORT}`);
});
