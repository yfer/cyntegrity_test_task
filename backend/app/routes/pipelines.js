import { Router } from 'express';
import Docker from 'dockerode';
import Streams from 'memory-streams';

const router = Router();
router.get('/', (req, res) => {
  return res.send('Pipelines');
});

router.get('/run', async (req, res) => {
  var docker = new Docker({socketPath: process.env.DOCKER_SOCKET});
  
  try {    
    // todo: need handling of missing container, now just add container to docker-compose
    var writer = new Streams.WritableStream(); 
    var container = await docker.run(process.env.CONTAINER_IMAGE_TO_RUN, [], writer);
    
    await container.wait();
    var result = writer.toString();
    await container.remove();

    
    return res.send('Pipeline finished with result:' + result);
  } catch(err) {
    return res.send(err);
  }

});

export default router;