import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: {
    type: String,
  },
  avarageTimeInSeconds: {
    type: Number
  }
});

const Task = mongoose.model('Task', taskSchema);
export default Task;