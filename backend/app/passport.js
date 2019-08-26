import passport from 'passport';
import LocalStrategy from 'passport-local';
import models from './models';

passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, 
    function (username, password, done) {
      return models.User.findByUsernameAndPassword(username, password).then(user => {
        if (!user) {
            return done(null, false, {message: 'Incorrect username or password.'});
        }
        return done(null, user, {message: 'Logged In Successfully'});
      }).catch(err => done(err));
    }
));