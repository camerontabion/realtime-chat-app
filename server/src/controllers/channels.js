import express from 'express';
import Joi from 'joi';
import Channel from '../models/channel.js';
import User from '../models/user.js';

const router = express.Router();

const channelSchema = Joi.object({
  name: Joi.string()
    .min(1)
    .max(16)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Username can only include alphanumeric characters and "_"',
    }),
});

router.get('/all', async (req, res, next) => {
  try {
    // get all channels
    const channels = await Channel.find();
    res.json(channels);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const existingChannel = await Channel
      .findById(req.params.id)
      .populate({
        path: 'users',
        select: 'username',
      })
      .populate({
        path: 'messages',
        select: 'text createdAt user',
        options: {
          sort: { createdAt: -1 },
          limit: 10,
        },
        populate: {
          path: 'user',
          select: 'username',
        },
      });
    if (!existingChannel) throw new Error('Channel does not exist!');
    existingChannel.messages.reverse();
    res.json(existingChannel);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    // Validate incoming channel name
    const { name } = await channelSchema.validateAsync(req.body);

    // Create new channel
    const channel = new Channel({ name });
    const savedChannel = await channel.save();

    // Add user to channel
    const user = await User.findOneAndUpdate(
      { username: req.session.username },
      { $push: { channels: savedChannel.id } },
      { new: true },
    );
    savedChannel.users.push(user.id);
    await savedChannel.save();
    await savedChannel.populate({
      path: 'users',
      select: 'username',
    }).execPopulate();

    // Return channel
    res.json(savedChannel);
  } catch (err) {
    next(err);
  }
});

router.put('/join/:id', async (req, res, next) => {
  try {
    // Get channel
    const channel = await Channel
      .findById(req.params.id)
      .populate({
        path: 'messages',
        select: 'text createdAt user',
        populate: {
          path: 'user',
          select: 'username',
        },
      });
    if (!channel) throw new Error('Channel does not exist!');

    // Check if user is already in channel
    const user = await User.findOne({ username: req.session.username });
    if (channel.users.includes(user.id)) throw new Error('User already in channel!');

    // Add user to channel
    user.channels.push(req.params.id);
    await user.save();
    channel.users.push(user.id);
    await channel.save();
    await channel.populate({
      path: 'users',
      select: 'username',
    }).execPopulate();

    // Return channel
    res.json(channel);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    // Delete channel
    await Channel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Channel successfully deleted!' });
  } catch (err) {
    next(err);
  }
});

export default router;
