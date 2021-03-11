import mongoose from 'mongoose';
import transform from '../utils/transform.js';

const messageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

messageSchema.set('toJSON', { transform });

export default mongoose.model('Message', messageSchema);
