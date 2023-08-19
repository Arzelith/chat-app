const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connect = require('./db/db-connect');
//ROUTE IMPORTS
const userRoutes = require('./routes/user-routes');
const authRoutes = require('./routes/auth-routes');
const refreshRoutes = require('./routes/refresh-routes');
const logoutRoutes = require('./routes/logout-routes');
const chatRoutes = require('./routes/chat-routes');
const messageRoutes = require('./routes/message-routes');
const favoriteRoutes = require('./routes/favorite-routes');
//END ROUTE-IMPORTS

const User = require('./models/user-model');
const Chat = require('./models/chat-model');

const cookieParser = require('cookie-parser');
const apiErrorHandler = require('./middlewares/api-error-handler');
const app = express();
dotenv.config();

app.use(
  cors({
    origin:
      process.env.NODE_ENV !== 'production'
        ? ['http://localhost:3000']
        : [process.env.ORIGIN],
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    optionSuccessStatus: 200,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '20mb' }));
app.use(cookieParser());

if (process.env.NODE_ENV !== 'production') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}

//ROUTES
const v1 = '/chat-app-api/v1';
app.use(`${v1}/users`, userRoutes);
app.use(`${v1}/auth`, authRoutes);
app.use(`${v1}/refresh`, refreshRoutes);
app.use(`${v1}/logout`, logoutRoutes);
app.use(`${v1}/chat`, chatRoutes);
app.use(`${v1}/message`, messageRoutes);
app.use(`${v1}/favorite`, favoriteRoutes);

//END ROUTES
app.use(apiErrorHandler);

const port = process.env.PORT || 5000;
const startServer = async () => {
  await connect(process.env.MONGO_URI);
  try {
    const server = app.listen(port, () => {
      console.log(`Server corriendo en puert:${port}`);
    });
    //SOCKET.IO
    const io = require('socket.io')(server, {
      cors: {
        origin:
          process.env.NODE_ENV !== 'production'
            ? ['http://localhost:3000']
            : [process.env.ORIGIN],
        credentials: true,
        methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
      },
    });
    io.on('connection', async (socket) => {
      let userId;

      const emitForUsers = (arr, emit, toString, payload) => {
        if (arr.lenght < 1) return;
        arr.forEach((c) => {
          c.users.forEach((user) => {
            let id = toString ? user.toString() : user._id;
            if (id !== userId) {
              if (!payload) {
                socket.in(id).emit(emit, userId);
              } else {
                socket.in(id).emit(emit, payload);
              }
            }
          });
        });
      };

      const handleConnection = async (emit, userId, online) => {
        await User.findByIdAndUpdate(userId, { isOnline: online });
        const chats = await Chat.find({ users: userId });
        emitForUsers(chats, emit, true);
      };

      socket.on('setup', async (user) => {
        socket.join(user._id);
        socket.emit('connected');
        userId = user._id;
        await handleConnection('user connected', userId, '1');
      });

      socket.on('new message', ({ message }) => {
        let chat = message.chat;
        if (!chat.users) return;
        chat.users.forEach((user) => {
          if (user._id !== message.sender._id) {
            socket.in(user._id).emit('new message recieved', message);
          }
        });
      });

      socket.on('status changed', (chatList) => {
        emitForUsers(chatList, 'new user status', false);
      });

      socket.on('user update', ({ chatList, user }) => {
        emitForUsers(chatList, 'user updated', false, user);
      });

      socket.on('disconnect', async () => {
        await handleConnection('user disconnected', userId, '0');
      });
    });

    //END SOCKET.IO
  } catch (error) {
    console.log(error);
  }
};

startServer();
