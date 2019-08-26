import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = Router();

// router.get('/logout', async (req, res) => {
//   var tasks = await Task.find();
//   return res.json(tasks);
// });

router.post('/login', (req, res, next) => {
  const { body: user } = req;

  if(!user.username) {
    return res.status(422);
  }

  if(!user.password) {
    return res.status(422);
  }

  return passport.authenticate('local', {session: false}, (err, user) => { 
    if (err || !user) {
      return res.status(400).json({
        message: 'Something is not right',
        user   : user
      });
    }

    req.login(user, {session: false}, (err) => {
      const id = user.id;
      if (err) {
        res.send(err);
      }
      const token = jwt.sign(id, process.env.JWT_SECRET);
      return res.json({id, token});
    });

  })(req, res, next);
});

export default router;