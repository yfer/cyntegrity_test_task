import { Router } from 'express';
import Docker from 'dockerode';
import Streams from 'memory-streams';
import Pipeline from '../models/pipeline';

const router = Router();
router.get('/', async (req, res) => {
  var tasks = await Pipeline.find().populate('children');
  return res.json(tasks);
});

router.post('/', async (req, res) => {
  const userid = req.user;
  const pipeline = new Pipeline(req.body);
  pipeline.user = userid;
  await pipeline.save();
  return res.status(201).send(pipeline); 
});

router.get('/:pipelineId', async (req, res) => {
  try {
    var pipeline = await Pipeline.findById(req.params.pipelineId).populate('children');
    return res.json(pipeline);
  } catch(err) {
    return res.send(err);
  }
});
router.delete('/:pipelineId', async (req, res) => {
  try {
    var pipeline = await Pipeline.findByIdAndRemove(req.params.pipelineId);
    return res.json(pipeline);
  } catch(err) {
    return res.send(err);
  }
});

router.delete('/:pipelineId/task/:taskId', async (req, res) => {
  try {
    var pipeline = await Pipeline.findById(req.params.pipelineId).populate('children');
    pipeline.children.remove(req.params.taskId);
    await pipeline.save();
    return res.json(pipeline);
  } catch(err) {
    return res.send(err);
  }
});

router.post('/:pipelineId/task/:taskId', async (req, res) => {
  try {
    var pipeline = await Pipeline.findById(req.params.pipelineId);
    pipeline.children.push(req.params.taskId);
    await pipeline.save();
    
    var updated = await Pipeline.findById(req.params.pipelineId).populate('children');
    return res.json(updated);
  } catch(err) {
    return res.send(err);
  }
});

router.post('/:pipelineId/run', async (req, res) => {
  const id = req.params.pipelineId;
  // var pipeline = await Pipeline.findById(id).populate('children');

  var docker = new Docker({socketPath: process.env.DOCKER_SOCKET});
  
  try {

    var options = {
      HostConfig: {
        NetworkMode: "cyntegrity_internal"
      }
    };
    // todo: need handling of missing container, for now just add container to docker-compose
    var writer = new Streams.WritableStream(); 
    var container = await docker.run(process.env.CONTAINER_IMAGE_TO_RUN, 
      [
        process.env.MONGO_CONNECTION_STRING,  
        process.env.MONGO_DB, 
        id
      ], 
      writer, options);
    
    await container.wait();
    var result = writer.toString();
    await container.remove();

    
    return res.send(result);
  } catch(err) {
    return res.send(err);
  }

});

export default router;