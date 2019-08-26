import mongoose from 'mongoose';
import User from './user';
import Task from './task';

const connectDb = () => {
  return mongoose.connect(process.env.MONGO_CONNECTION_STRING, { 
    useNewUrlParser: true, 
    useCreateIndex: true,
  });
};
const models = { User, Task };

export { connectDb };
export default models;