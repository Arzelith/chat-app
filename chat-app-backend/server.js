const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connect = require('./db/db-connect');
//ROUTE IMPORTS
//END ROUTE-IMPORTS
const cookieParser = require('cookie-parser');
//ERROR HANDLER IMPORT
//END ERROR HANDLER IMPORT
const app = express();
dotenv.config();

app.use(
  cors({
    origin:
      process.env.NODE_ENV !== 'production'
        ? ['http://localhost:3000', 'http://127.0.0.1:3000']
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
const v1 = '/chat-api/v1';
//END ROUTES

//ERROR MIDDLEWARE
//END ERROR MIDDLEWARE

const port = process.env.PORT || 5000;
const startServer = async () => {
  await connect(process.env.MONGO_URI);
  try {
    const server = app.listen(port, () => {
      console.log(`Server corriendo en puert:${port}`);
    });
    //SOCKET.IO
    //END SOCKET.IO
  } catch (error) {
    console.log(error);
  }
};

startServer();
