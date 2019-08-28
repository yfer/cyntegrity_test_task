import mongoose from 'mongoose';

const pipelineSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: {
    type: String,
  },
  children: [{
    type: mongoose.Schema.Types.ObjectId, ref: "Task"
  }],
});

const Pipeline = mongoose.model('Pipeline', pipelineSchema);
export default Pipeline;