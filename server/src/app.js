import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoose from 'mongoose';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import dotenv from 'dotenv';

import {
  notFound, handleError, isLoggedIn, wrap,
} from './utils/middleware.js';
import auth from './controllers/auth.js';
import users from './controllers/users.js';
import channels from './controllers/channels.js';
import messages, { socketMessages } from './controllers/messages.js';

// Initialize .env
dotenv.config({ path: './src/.env' });

// Connect to DB
(async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log('Connected!');
  } catch (err) {
    console.error(`Error connecting: ${err}`);
    process.exit(1);
  }
})();

// Create express app
const app = express();
const http = createServer(app);

// Setup messaging socket server
const socketServer = new Server(http, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
});

// Middleware
app.use(morgan('dev'));
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sessions
const MongoStore = connectMongo.default;
export const sessions = session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 10,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions',
  }),
});

app.use(sessions);
socketServer.use(wrap(sessions));

// Socket messaging
socketServer.use(wrap(isLoggedIn));
socketServer.on('connection', (socket) => socketMessages(socket, socketServer));
socketServer.on('connect_error', (err) => {
  console.log(err.message);
});

// Routes
app.use('/api/auth', auth);
app.use('/api/users', isLoggedIn, users);
app.use('/api/channels', isLoggedIn, channels);
app.use('/api/messages', isLoggedIn, messages);

// Error Handling
app.use(notFound);
app.use(handleError);

export default http;
