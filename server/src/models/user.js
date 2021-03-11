import mongoose from 'mongoose';
import transform from '../utils/transform.js';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  channels: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel',
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

userSchema.set('toJSON', { transform });

export default mongoose.model('User', userSchema);
