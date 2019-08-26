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

userSchema.statics.findByLogin = async function (login) {
  const user = await this.findOne({
    username: login,
  });
  return user;
};

userSchema.pre('remove', function(next) {
  this.model('Task').deleteMany({ user: this._id }, next);
});

const User = mongoose.model('User', userSchema);
export default User;