import models from './models';

export async function fillMongoWithDefaultData() {
  const users = ['1', '2', '3'].map(id => new models.User({
    username: 'username' + id,
    password: 'password' + id
  }));
  const size = users.length;
  const tasks = [0,1,2,3,4,5,6,7,8,9,10].map(pos => new models.Task({
    name: users[pos%size].username + ' task' + pos,
    avarageTimeInSeconds: 2,
    user: users[pos%size].id
  }));

  const pipelines = [0,1,2,3,4].map(pos => new models.Pipeline({
    name: users[pos%size].username + ' pipeline' + pos,
    user: users[pos%size].id,
    children: [
      tasks[pos*2].id,
      tasks[pos*2+1].id
    ]
  }))

  await models.User.insertMany(users);
  await models.Task.insertMany(tasks);
  await models.Pipeline.insertMany(pipelines);
}

export async function clearCollections() {
  await Promise.all([
    models.Pipeline.deleteMany({}),
    models.User.deleteMany({}),
    models.Task.deleteMany({}),
  ]);
}
