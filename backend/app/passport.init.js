import passport from 'passport';
import LocalStrategy from 'passport-local';
import passportJWT from 'passport-jwt';
import models from './models';

export function InitPassport() {

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

  const JWTStrategy = passportJWT.Strategy;
  const ExtractJWT = passportJWT.ExtractJwt;

  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey   : process.env.JWT_SECRET
      },
      function (jwtPayload, cb) {
        const userid = jwtPayload;
        return cb(null, userid);
      }
    )
  );

}