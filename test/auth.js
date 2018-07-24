'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const { app, runServer, closeServer } = require('../server');
const { User } = require('../models/user');
const { JWT_SECRET, TEST_DATABASE_URL, PORT } = require('../config');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Auth endpoints', () =>  {
  const email = 'Test@test.com';
  const username = 'TestUser';
  const password = 'TestPass';
  const firstname = 'John';
  const lastname = 'Doe';

  before(() =>  {
    return runServer(TEST_DATABASE_URL);
  });

  after(() =>  {
    return closeServer();
  });

  beforeEach(() =>  {
    return User.hashPassword(password).then(password =>
      User.create({
        email,
        username,
        password,
        firstname,
        lastname
      })
    );
  });

  afterEach(() =>  {
    return User.remove({});
  });

  describe('/api/auth/login', () =>  {
    it('Should reject requests with no credentials', () =>  {
      return chai
        .request(app)
        .post('/api/auth/login')
        .send({})
        .then((res) => {
          expect(res).to.have.status(400);
        })
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }
        });
    });
    it('Should reject requests with incorrect usernames', () =>  {
      return chai
        .request(app)
        .post('/api/auth/login')
        .send({ username: 'wrongusername', password })        
        .then((res) => {
          expect(res).to.have.status(401);
        })
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }
        });
    });
    it('Should reject requests with incorrect passwords', () =>  {
      return chai
        .request(app)
        .post('/api/auth/login')
        .send({ username, password: 'wrongPassword' })
        .then((res) => {
          expect(res).to.have.status(401);
        })
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }
        });
    });
    it('Should return a valid auth token', () =>  {
      return chai
        .request(app)
        .post('/api/auth/login')
        .send({ username, password })
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          const token = res.body.token;
          expect(token).to.be.a('string');
          const payload = jwt.verify(token, JWT_SECRET, {
            algorithm: ['HS256']
          });
          expect(payload.user).to.deep.equal({
            email,
            username,
            firstname,
            lastname
          });
        });
    });
  });

  describe('/api/auth/refresh', () =>  {
    it('Should reject requests with no credentials', () =>  {
      return chai
        .request(app)
        .post('/api/auth/refresh')
        .then(() => {
          expect(res).to.have.status(401);
          expect(res.body.reason).to.equal('Unauthorized');
        })
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }
        });
    });
    it('Should reject requests with an invalid token', () =>  {
      const token = jwt.sign(
        {
          username,
          firstname,
          lastname
        },
        'wrongSecret',
        {
          algorithm: 'HS256',
          expiresIn: '7d'
        }
      );

      return chai
        .request(app)
        .post('/api/auth/refresh')
        .set('Authorization', `Bearer ${token}`)
        .then(() => {
          expect(res).to.have.status(401);
          expect(res.body.reason).to.equal('Unauthorized');  
        })
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }
        });
    });
    it('Should reject requests with an expired token', () =>  {
      const token = jwt.sign(
        {
          user: {
            username,
            firstname,
            lastname
          },
          exp: Math.floor(Date.now() / 1000) - 10 // Expired ten seconds ago
        },
        JWT_SECRET,
        {
          algorithm: 'HS256',
          subject: username
        }
      );

      return chai
        .request(app)
        .post('/api/auth/refresh')
        .set('authorization', `Bearer ${token}`)
        .then(() => {
          expect(res).to.have.status(401);
          expect(res.body.reason).to.equal('Unauthorized');
        })
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }
        });
    });
    it('Should return a valid auth token with a newer expiry date', function () {
      const token = jwt.sign(
        {
          user: {
            username,
            firstname,
            lastname
          }
        },
        JWT_SECRET,
        {
          algorithm: 'HS256',
          subject: username,
          expiresIn: '7d'
        }
      );
      const decoded = jwt.decode(token);

      return chai
        .request(app)
        .post('/api/auth/refresh')
        .set('authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          const token = res.body.authToken;
          expect(token).to.be.a('string');
          const payload = jwt.verify(token, JWT_SECRET, {
            algorithm: ['HS256']
          });
          expect(payload.user).to.deep.equal({
            username,
            firstname,
            lastname
          });
          expect(payload.exp).to.be.at.least(decoded.exp);
        });
    });
  });
});
