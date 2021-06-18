require('dotenv/config');
const express = require('express');
const app = express();
const jsonMiddleware = express.json();
const staticMiddleware = require('./static-middleware');
const ClientError = require('./client-error');
const errorMiddleware = require('./error-middleware');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const jwt = require('jsonwebtoken');
const pg = require('pg');
const argon2 = require('argon2');

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(staticMiddleware);
app.use(jsonMiddleware);

io.on('connection', socket => {
  socket.on('join_chat', data => {
    socket.join(data.chatRoomId);
  });
  socket.on('leave_room', data => {
    socket.leave(data.roomID);
  });

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

app.get('/api/joinRoom/:chatId', (req, res, next) => {
  const id = parseInt(req.params.chatId);
  if (!id) {
    throw new ClientError(400, 'Chat ID must be a number');
  }
  const sql = `
    select *
      from "chatRooms"
     where "chatId" = $1
  `;
  const params = [id];
  db.query(sql, params)
    .then(result => {
      const chatRoom = result.rows[0];
      res.status(200).json(chatRoom);
    })
    .catch(err => next(err));
});

app.get('/api/newRoomMember/:chatId', (req, res, next) => {
  const roomId = req.params.chatId;
  const sql = `
    select "members"
      from "chatRooms"
     where "chatId" = $1
  `;
  const params = [roomId];
  db.query(sql, params)
    .then(result => {
      res.status(200).json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.get('/api/getUserRooms/:userId', (req, res, next) => {
  const id = req.params.userId;
  const sql = `
    select "chatRooms"
      from "users"
     where "userId" = $1
  `;
  const params = [id];
  db.query(sql, params)
    .then(result => {
      res.status(200).json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.get('/api/getRoomMembers/:chatId', (req, res, next) => {
  const id = req.params.chatId;
  const sql = `
    select "members"
      from "chatRooms"
     where "chatId" = $1
  `;
  const params = [id];
  db.query(sql, params)
    .then(result => {
      res.status(200).json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.post('/api/newRoom', (req, res, next) => {
  const { chatName, members } = req.body;
  if (!chatName) {
    throw new ClientError(400, 'Chat name and username are required');
  }
  const sql = `
    insert into "chatRooms" ("name", "members")
           values ($1, $2)
      returning *
  `;
  const params = [chatName, JSON.stringify(members)];
  db.query(sql, params)
    .then(result => {
      const chatRoom = result.rows[0];
      res.status(201).json(chatRoom);
    })
    .catch(err => next(err));
});

app.post('/api/chat/:chatId', (req, res, next) => {
  const { message, sender } = req.body;
  const roomId = req.params.chatId;
  const sql = `
    insert into "messages" ("message", "chatId", "sender")
           values ($1, $2, $3)
      returning *
  `;
  const params = [message, roomId, sender];
  db.query(sql, params)
    .then(result => {
      io.to(roomId).emit('new_message', result.rows[0]);
      res.status(200).send();
    })
    .catch(err => next(err));
});

app.post('/api/auth/sign-up', (req, res, next) => {
  const { username, password } = req.body;
  argon2.hash(password)
    .then(hashedPassword => {
      const sql = `
        insert into "users" ("userName", "hashedPassword", "chatRooms")
              values ($1, $2,$3)
          returning *
      `;
      const chatRooms = [];
      const params = [username, hashedPassword, JSON.stringify(chatRooms)];
      db.query(sql, params)
        .then(result => {
          const user = result.rows[0];
          const payload = {
            userId: user.userId,
            username: user.userName,
            chatRooms: user.chatRooms
          };
          const token = jwt.sign(payload, process.env.TOKEN_SECRET);
          res.status(201).json({ token: token, user: payload });
        })
        .catch(err => next(err));
    });
});

app.post('/api/auth/sign-in', (req, res, next) => {
  const { username, password: providedPassword } = req.body;
  const sql = `
    select "userName",
           "userId",
           "hashedPassword",
           "chatRooms"
      from "users"
     where "userName" = $1
  `;
  const params = [username];
  db.query(sql, params)
    .then(result => {
      const { userName: username, hashedPassword, userId, chatRooms } = result.rows[0];
      argon2
        .verify(hashedPassword, providedPassword)
        .then(verified => {
          if (!verified) {
            throw new ClientError(401, 'Invalid log in');
          }
          const payload = {
            userId: userId,
            username: username,
            chatRooms: chatRooms
          };
          const token = jwt.sign(payload, process.env.TOKEN_SECRET);
          res.status(201).json({ token: token, user: payload });
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

app.put('/api/users/:userId', (req, res, next) => {
  const updatedRooms = req.body.chatRooms;
  const userId = req.params.userId;
  const sql = `
    update "users"
       set "chatRooms" = $1
     where "userId" = $2
     returning *
  `;
  const params = [JSON.stringify(updatedRooms), userId];
  db.query(sql, params)
    .then(result => {
      const user = result.rows[0];
      const payload = {
        userId: user.userId,
        userName: user.userName,
        chatRooms: user.chatRooms
      };
      const token = jwt.sign(payload, process.env.TOKEN_SECRET);
      res.status(200).json({ token: token, user: payload });
    })
    .catch(err => next(err));
});

app.put('/api/newRoomMember/:chatId', (req, res, next) => {
  const { members } = req.body;
  const roomId = req.params.chatId;
  const sql = `
    update "chatRooms"
       set "members" = $1
     where "chatId" = $2
  `;
  const params = [JSON.stringify(members), roomId];
  db.query(sql, params)
    .then(result => {
      res.status(200).send();
    })
    .catch(err => next(err));
});

app.put('/api/updateRoomMembers/:chatId', (req, res, next) => {
  const id = req.params.chatId;
  const { updatedMembers } = req.body;
  const sql = `
    update "chatRooms"
       set "members" = $1
     where "chatId" = $2
  `;
  const params = [JSON.stringify(updatedMembers), id];
  db.query(sql, params)
    .then(result => {
      res.status(200).send();
    })
    .catch(err => next(err));

});

app.put('/api/username/:userId', (req, res, next) => {
  const { userId } = req.params;
  const { username } = req.body;
  const sql = `
    update "users"
       set "userName" = $1
     where "userId" = $2
     returning *
  `;
  const params = [username, userId];
  db.query(sql, params)
    .then(result => {
      const user = result.rows[0];
      const payload = {
        userId: user.userId,
        username: user.userName,
        chatRooms: user.chatRooms
      };
      const token = jwt.sign(payload, process.env.TOKEN_SECRET);
      res.status(200).json({ token: token, user: payload });
    });
});

app.use(errorMiddleware);

server.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`http server listening on port ${process.env.PORT}`);
});
