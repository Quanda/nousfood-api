'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const { createAuthToken } = require('../routers/auth');
const { app, runServer, closeServer } = require('../server.js');
const { User } = require('../models/user');
const { JWT_SECRET, TEST_DATABASE_URL, PORT } = require('../config');
const expect = chai.expect;
const jwt = require('jsonwebtoken');

chai.use(chaiHttp);

  describe('/api/users', () => {
    const email = 'Testguy@test.com';
    const username = "Tester";
    const firstname = "Testy";
    const lastname = "McTest";
    const password = "nousfood";
    
    const stack = {
        code: "fjhew89423",
        name: "teststack123",
        contents: [
            {
                code: "noop1",
                name: "test noop 1"
            },
            {
                code: "noop2",
                name: "test noop 2"
            }
        ],
        description: "test description",
        directive: "test directive",
        author: "test author"
    }
    const updatedStack = {
        code: "343r23f3",
        author: "King James"
    }

    before(() => {
        return runServer(TEST_DATABASE_URL);
      });

      after(() =>  {
        return closeServer();
      });

      beforeEach(() =>  {});

      afterEach(() =>  {
        return User.remove({});
      });


    describe('POST', () => {
        it('Should LOGIN then ADD, GET, UPDATE, DELETE stack', () => {
            let token;
            return User.hashPassword(password).then(password =>
              User.create({
                email,
                firstname,
                lastname,
                username,
                password
              })
            )
            .then(res => { // login
                return chai
                .request(app)
                .post('/api/auth/login')
                .send({ username, password})
                .then(res => {
                  expect(res).to.have.status(200);
                  expect(res.body).to.be.an('object');
                  token = res.body.token;
                  expect(token).to.be.a('string');
                  const payload = jwt.verify(token, JWT_SECRET, {
                    algorithm: ['HS256']
                  });
                })
            })
            .then(res => { // create stack
                return chai
                 .request(app)
                 .post(`/api/${username}/stacks`)
                 .set('Authorization', 'Bearer ' + token)
                 .send(stack)
                 .then(res => {
                   expect(res).to.have.status(200);
                   expect(res.body).to.be.an('object');
                   expect(res.body).to.equal(stack)
                   return res.body;
                 })
                 .catch(err => {
                    console.log(err);
                    return err;
                })
            })
            .then(() => { // get stack
             return chai
              .request(app)
              .get(`/api/${username}/stacks/${stack.code}`)
              .set('Authorization', 'Bearer ' + token)
              .then(res => {
                expect(res).to.have.status(200);
                return res.body;
              })
              .catch(err => {
                 console.log(err);
                 return err;
             })
            })
            .then(() => { // get all stacks
                return chai
                 .request(app)
                 .get(`/api/${username}/stacks`)
                 .set('Authorization', 'Bearer ' + token)
                 .then(res => {
                   expect(res).to.have.status(200);
                   expect(res.body).to.be.an('array');
                   return res.body;
                 })
                 .catch(err => {
                    console.log(err);
                    return err;
                })
            })
            .then(() => { // update stack
             return chai
              .request(app)
              .put(`/api/${username}/stacks/${updatedStack.code}/${updatedStack}`)
              .set('Authorization', 'Bearer ' + token)
              .then(res => {
                expect(res).to.have.status(200);
                expect(res.body.nModified).to.equal(1);
                return res.body;
              })
              .catch(err => {
                 console.log(err);
                 return err;
             })
            }) 
            .then(() => { // delete stack
             return chai
              .request(app)
              .delete(`/api/${username}/stacks/${stack.code}`)
              .set('Authorization', 'Bearer ' + token)
              .then(res => {
                expect(res).to.have.status(204);
                return res.body;
              })
              .catch(err => {
                 console.log(err);
                 return err;
             })
            }) 
          });
        });
    });