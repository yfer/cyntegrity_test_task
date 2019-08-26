import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
});

userSchema.statics.findByUsernameAndPassword = async function (username, password) {
  const user = await this.findOne({
    username: username,
    password: password
  });
  return user;
};

userSchema.pre('remove', function(next) {
  this.model('Task').deleteMany({ user: this._id }, next);
});

const User = mongoose.model('User', userSchema);
export default User;