import express from 'express';
import User from '../models/user.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

router.delete('/:id', async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User successfully deleted!' });
  } catch (err) {
    next(err);
  }
});

export default router;
