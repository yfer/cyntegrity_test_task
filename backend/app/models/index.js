import mongoose from 'mongoose';
import User from './user';
import Task from './task';
import Pipeline from './pipeline';

const connectDb = () => {
  return mongoose.connect(process.env.MONGO_CONNECTION_STRING, { 
    dbName: process.env.MONGO_DB,
  });
};
const models = { User, Task, Pipeline };

export { connectDb };
export default models;