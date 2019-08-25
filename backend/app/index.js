import dotenv from 'dotenv';
import express from 'express';
import routes from './routes';

const config_result = dotenv.config();
if (config_result.error) {
  throw config_result.error
}

const app = express();

app.use('/tasks', routes.tasks);
app.use('/pipelines', routes.pipelines);

app.get('/', (req, res) => {
  res.send(process.env.VERSION);
});

app.listen(process.env.PORT, () =>
  console.log('Backend running on port ' + process.env.PORT),
);