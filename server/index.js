require('dotenv/config');
const express = require('express');
const staticMiddleware = require('./static-middleware');
const ClientError = require('./client-error');
const errorMiddleware = require('./error-Middleware');

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

io.on('connection', socket => {
  console.log('connected!');
});

app.get('/api/chatRooms', (req, res, next) => {
  const sql = `
    select "name",
           "chatId" as "id"
      from "chatRooms"
      order by "chatId" desc;
  `;
  db.query(sql)
    .then(result => {
      const chatRooms = result.rows;
      res.status(200).json(chatRooms);
    })
    .catch(err => next(err));
});

app.get('/api/rooms/:roomId', (req, res, next) => {
  const roomId = parseInt(req.params.roomId);
  const sql = `
    select *
      from "chatRooms"
      where "chatId" = $1;
  `;
  const params = [roomId];
  db.query(sql, params)
    .then(result => {
      res.status(200).json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.post('/api/newRoom', (req, res, next) => {
  const { chatName, userName } = req.body;
  if (!chatName || !userName) {
    throw new ClientError(400, 'Chat name and username are required');
  }
  const sql = `
    insert into "chatRooms" ("name", "host")
           values ($1, $2)
      returning *
  `;
  const params = [chatName, userName];
  db.query(sql, params)
    .then(result => {
      const chatRoom = result.rows[0];
      res.status(201).json(chatRoom);
    })
    .catch(err => next(err));
});

app.post('/api/chat/:chatId', (req, res, next) => {
  console.log(req.body);
  const { message } = req.body;
  const roomId = req.params.chatId;
  const sql = `
    insert into "messages" ("message", "chatId")
           values ($1, $2)
      returning *
  `;
  const params = [message, roomId];
  db.query(sql, params)
    .then(result => {
      res.status(200).json(result.rows[0]);
    });
  // io.to();
});

app.use(errorMiddleware);

server.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`http server listening on port ${process.env.PORT}`);
});
