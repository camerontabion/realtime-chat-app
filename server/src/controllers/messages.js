import express from 'express';
import User from '../models/user.js';
import Channel from '../models/channel.js';
import Message from '../models/message.js';

const router = express.Router();

// Socket messaging
export const socketMessages = async (socket, socketServer) => {
  // Get user associated with socket
  const user = await User.findOne({ username: socket.request.session.username });

  socket.on('join', async (prevChannel, channel) => {
    // Leave previous channel
    socket.leave(prevChannel);

    // Add socket to channel
    socket.join(channel);
    console.log('joining:', channel);
  });

  socket.on('message', async (channelId, text) => {
    // Find channel
    const channel = await Channel.findById(channelId);

    // Create a save new message
    const message = new Message({ text, user: user.id });
    const savedMessage = await message.save();
    await savedMessage.populate({
      path: 'user',
      select: 'username',
    }).execPopulate();

    // Add message id to user messages array
    user.messages.push(savedMessage.id);
    await user.save();

    // Add message id to channel messages array
    channel.messages.push(savedMessage.id);
    await channel.save();

    // Send message to all connected clients
    socketServer.to(channelId).emit('message', savedMessage);
  });
};

router.get('/', async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.session.username });
    const messages = await Message.find({ user: user.id });
    res.json(messages);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const user = await User.findOneAndUpdate(
      { username: req.session.username },
      { $pull: { messages: { id: req.params.id } } },
    );
    await Message.findByIdAndDelete(req.params.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

export default router;
