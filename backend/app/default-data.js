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
  await models.User.insertMany(users);
  await models.Task.insertMany(tasks);
}

export async function clearCollections() {
  await Promise.all([
    models.User.deleteMany({}),
    models.Task.deleteMany({}),
  ]);
}
