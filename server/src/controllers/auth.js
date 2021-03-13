import express from 'express';
import bcrypt from 'bcrypt';
import Joi from 'joi';
import User from '../models/user.js';
import Channel from '../models/channel.js';

const router = express.Router();

const authSchema = Joi.object({
  username: Joi.string()
    .min(2)
    .max(30)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Username can only include alphanumeric characters and "_"',
    }),
  password: Joi.string()
    .min(6)
    .required(),
});

router.post('/register', async (req, res, next) => {
  try {
    // Validate incoming user info
    const { username, password } = await authSchema.validateAsync(req.body);

    // Check if there is a user
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(409);
      throw new Error('Username already exists!');
    }

    // Encrypt password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({ username, passwordHash });

    // Add default channel
    const channel = new Channel({ name: `me (${newUser.username})` });
    const savedChannel = await channel.save();
    savedChannel.users.push(newUser.id);
    await savedChannel.save();

    newUser.channels.push(savedChannel.id);
    const savedUser = await newUser.save();
    await savedUser.populate({
      path: 'channels',
      select: 'name',
    }).execPopulate();

    // Create session
    req.session.username = savedUser.username;

    // Send back registered user
    res.json({
      id: savedUser.id,
      username: savedUser.username,
      channels: savedUser.channels,
      joined: savedUser.createdAt,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    // Validate incoming user info
    const { username, password } = await authSchema.validateAsync(req.body);

    // Check if a user with the provided username exists
    const existingUser = await User
      .findOne({ username })
      .populate({
        path: 'channels',
        select: 'name',
      });
    if (!existingUser) {
      res.status(401);
      throw new Error('Invalid email or password!');
    }

    // Check if the provided password matches the user's password
    const validPassword = await bcrypt.compare(password, existingUser.passwordHash);
    if (!validPassword) {
      res.status(401);
      throw new Error('Invalid email or password!');
    }

    // Create session
    req.session.username = existingUser.username;

    // Send back logged in user
    res.json({
      id: existingUser.id,
      username: existingUser.username,
      channels: existingUser.channels,
      joined: existingUser.createdAt,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  if (req.session.username) {
    const existingUser = await User
      .findOne({ username: req.session.username })
      .populate({
        path: 'channels',
        select: 'name',
      });
    res.json({
      id: existingUser.id,
      username: existingUser.username,
      channels: existingUser.channels,
      joined: existingUser.createdAt,
    });
  } else {
    next(new Error('Not logged in'));
  }
});

router.post('/logout', async (req, res, next) => {
  // Destroy session and delete cookie
  req.session.destroy((err) => {
    if (err) next(new Error(err));
    res.clearCookie('connect.sid').json({ message: 'Successfully logged out' });
  });
});

export default router;
