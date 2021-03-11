import mongoose from 'mongoose';
import transform from '../utils/transform.js';

const channelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

channelSchema.set('toJSON', { transform });

export default mongoose.model('Channel', channelSchema);
