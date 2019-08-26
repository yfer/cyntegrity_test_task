import { Router } from 'express';
const router = Router();
import Task from '../models/task';

router.get('/', async (req, res) => {
  var tasks = await Task.find();
  return res.json(tasks);
}).post( async (req, res) => {
  //todo: add user id from context
  const task = new Task(req.body);
  await task.save();
  return res.status(201).send(task); 
});

router.get('/:taskId', async (req, res) => {
  try {
    var task = await Task.findById(req.params.taskId);
    return res.json(task);
  } catch(err) {
    return res.send(err);
  }
});
//todo: .put for task updates

export default router;