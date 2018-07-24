const chai = require('chai');
const chaiHttp = require('chai-http');
const { createAuthToken } = require('../routers/auth');
const { app, runServer, closeServer } = require('../server.js');
const { User } = require('../models/user');
const { JWT_SECRET, TEST_DATABASE_URL, PORT } = require('../config');
const expect = chai.expect;
const faker = require('faker');
const jwt = require('jsonwebtoken');

chai.use(chaiHttp);


  describe('/api/stacks', () =>  {

    before(() =>  {
        runServer(TEST_DATABASE_URL);
    });

    after(() =>  {
        return closeServer();
    });

    beforeEach(() =>  {});

    afterEach(() =>  {});
     
    describe('GET', () =>  {
      it('should return all stacks from library', () => {
        return chai
        .request(app)
        .get(`/api/stacks`)
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          return res.body;
        })
        .catch(err => {
            return err;
        })
      });
    });
  })