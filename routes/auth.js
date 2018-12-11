require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jwt-simple');
const passport = require('passport');
const secret = process.env.secretWord;

router.post('/', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.json({
        err: true,
        message: 'Укажите правильный логин и пароль',
      });
    }
    if (user) {
      const payload = {
        id: user.id,
      };
      const token = jwt.encode(payload, secret);
      res.json({ err: false, token: token });
    }
  })(req, res, next);
});

module.exports = router;
