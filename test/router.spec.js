require('dotenv').config();
process.env.DB = 'testing';

const mongoose = require('mongoose');
const Cat = require('../models/schema');
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../app');
const secret = process.env.secretWord;
const issueToken = require('../helpers/issueToken');
chai.use(chaiHttp);

let token = issueToken({ id: '1241235123085789' }, secret);

describe('Cats', () => {
  beforeEach(function(done) {
    Cat.deleteMany({}, err => {
      done();
    });
  });

  describe('/Get cats', function() {
    it('Получить всех котов из API', function(done) {
      chai
        .request(server)
        .get('/api/v1.0/cats')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });
    it('Получить кота по id', function(done) {
      let cat = new Cat({ name: 'Barsik', age: 3 });
      cat.save().then(cat => {
        chai
          .request(server)
          .get('/api/v1.0/cats/' + cat.id)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.property('name');
            res.body.should.property('age');
            done();
          });
      });
    });
  });

  describe('/POST cats', function() {
    it('Сохраняем кота со всеми полями', function(done) {
      let cat = { name: 'Barsik', age: 3 };
      chai
        .request(server)
        .post('/api/v1.0/cats')
        .set('Authorization', `Bearer ${token}`)
        .send(cat)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.property('name');
          res.body.should.property('age');
          done();
        });
    });
    it('Сохраняем кота без поля name', function(done) {
      let cat = { age: 3 };
      chai
        .request(server)
        .post('/api/v1.0/cats')
        .set('Authorization', `Bearer ${token}`)
        .send(cat)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.property('err');
          done();
        });
    });
  });

  describe('/PUT cats', function() {
    it('Изменяем кота по id', function(done) {
      let cat = new Cat({ name: 'Barsik', age: 3 });
      cat.save().then(cat => {
        chai
          .request(server)
          .put('/api/v1.0/cats/' + cat.id)
          .set('Authorization', `Bearer ${token}`)
          .send({ name: 'Симка', age: 8 })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.property('name').equal('Симка');
            res.body.should.property('age').eql(8);
            done();
          });
      });
    });
  });
  describe('/DELETE cats', function() {
    it('Удаляем кота по id', function(done) {
      let cat = new Cat({ name: 'Barsik', age: 3 });
      cat.save().then(cat => {
        chai
          .request(server)
          .delete('/api/v1.0/cats/' + cat.id)
          .set('Authorization', `Bearer ${token}`)
          .send()
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.property('name');
            res.body.should.property('age');
            done();
          });
      });
    });
  });
});
