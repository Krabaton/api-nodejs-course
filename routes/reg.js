const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('../models/user');

router.post('/', (req, res, next) => {
  const { email, password } = req.body;
  //создаем экземпляр пользователя и указываем введенные данные
  const User = mongoose.model('user');
  User.findOne({ email }).then(u => {
    //если такой пользователь уже есть - сообщаем об этом
    if (u) {
      throw new Error('Такой пользователь уже существует!');
    }
    const adminUser = new User({ email });
    adminUser.setPassword(password);
    //если нет - добавляем пользователя в базу
    adminUser
      .save()
      .then(u => {
        return res.json({ msg: 'Пользователь создан', user: u });
      })
      .catch(e => console.log(e));
  });
});

module.exports = router;
