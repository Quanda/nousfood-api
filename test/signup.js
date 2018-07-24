const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server.js');
const { User } = require('../models/user');
const { JWT_SECRET, TEST_DATABASE_URL, PORT } = require('../config');

const expect = chai.expect;
const faker = require('faker');
const jwt = require('jsonwebtoken');

chai.use(chaiHttp);


  describe('/api/signup', () =>  {
      const email = 'exampleEmail@gmail.com'
      const username = 'exampleUser';
      const password = 'examplePass';
      const firstname = 'Example';
      const lastname = 'User';
      const emailB = 'exampleEmailB@gmail.com';
      const usernameB = 'exampleUserB';
      const passwordB = 'examplePassB';
      const firstnameB = 'ExampleB';
      const lastnameB = 'UserB';
      
      before(() =>  {
        return runServer(TEST_DATABASE_URL);
      });

      after(() =>  {
        return closeServer();
      });

      beforeEach(() =>  {});

      afterEach(() =>  {
        return User.remove({});
      });
     
    describe('POST', () =>  {
      it('Should reject users with missing email', () =>  {
        return chai
          .request(app)
          .post('/api/signup')
          .send({
            password,
            firstname,
            lastname
          })
          .then((res) => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.location).to.equal('email');
          })
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }
          });
      });
      it('Should reject users with missing password', () =>  {
        return chai
          .request(app)
          .post('/api/signup')
          .send({
            email,
            username,
            firstname,
            lastname
          })
          .then((res) => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.location).to.equal('password');
           })
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }
          });
      });
      it('Should reject users with empty email', () =>  {
        return chai
          .request(app)
          .post('/api/signup')
          .send({
            email: '',
            password,
            firstname,
            lastname
          })
          .then((res) => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.location).to.equal('email');
          })
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }
          });
      });
      it('Should reject users with password less than 6 characters', () =>  {
        return chai
          .request(app)
          .post('/api/signup')
          .send({
            email,
            password: '12345',
            firstname,
            lastname
          })
          .then((res) => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.location).to.equal('password');
            expect(res.body.message).to.equal('Must be at least 6 characters long');
           })
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }
          });
      });
      it('Should reject users with duplicate username', () =>  {
        // Create an initial user
        return User.create({
          username,
          email,
          password,
          firstname,
          lastname
        })
          .then(() =>
            // Try to create a second user with the same username
            chai.request(app).post('/api/signup').send({
              username,
              email: emailB,
              password,
              firstname,
              lastname
            })
          )
          .then((res) => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.location).to.equal('username');
            expect(res.body.message).to.equal('Username already taken');
           })
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }
          });
      });
      it('Should reject users with duplicate email', () => {
        // Create an initial user
        return User.create({
          email,
          password,
          firstname,
          lastname
        })
          .then(() =>
            // Try to create a second user with the same email
            chai.request(app).post('/api/signup').send({
              email,
              password,
              firstname,
              lastname
            })
          )
          .then((res) => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.location).to.equal('email');
            expect(res.body.message).to.equal('Email already taken');
           })
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }
          });
      });
      it('Should create a new user', () =>  {
        return chai
          .request(app)
          .post('/api/signup')
          .send({
            email,
            password,
            firstname,
            lastname
          })
          .then(res => {
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys(
              'email',
              'firstname',
              'lastname',
              "username"
            );
            expect(res.body.email).to.equal(email);
            expect(res.body.firstname).to.equal(firstname);
            expect(res.body.lastname).to.equal(lastname);
            return User.findOne({
              email
            });
          })
          .then(user => {
            expect(user).to.not.be.null;
            expect(user.firstname).to.equal(firstname);
            expect(user.lastname).to.equal(lastname);
            return user.validatePassword(password);
          })
          .then(passwordIsCorrect => {
            expect(passwordIsCorrect).to.be.true;
          });
      });
    });
     

  });
