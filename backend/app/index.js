import dotenv from 'dotenv';
import express from 'express';
import routes from './routes';
import { connectDb } from './models';
import { clearCollections, fillMongoWithDefaultData } from './default-data';
import bodyParser from 'body-parser';
import passport from 'passport';
import { InitPassport } from './passport.init';

const config_result = dotenv.config();
if (config_result.error) {
  throw config_result.error
}

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

InitPassport();

app.use('/auth', routes.auth);
app.use('/tasks', passport.authenticate('jwt', {session: false}), routes.tasks);
app.use('/pipelines', passport.authenticate('jwt', {session: false}), routes.pipelines);

app.get('/', (req, res) => {
  res.send(process.env.VERSION);
});

connectDb().then(async () => {
  await clearCollections();
  await fillMongoWithDefaultData();

  app.listen(process.env.PORT, () =>
    console.log('Backend running on port ' + process.env.PORT),
  );
});

