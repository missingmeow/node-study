
require('should');
const request = require('supertest');
const fs = require('fs');

const app = require('../app');


describe('GET /', function() {
    it('respond with "Hello World!"', function(done) {
        request(app)
        .get('/')
        .expect(function(res) {
            res.text.should.equal("Hello World!");
        })
        .expect(200, done);
    });
});

describe('GET /error', function() {
    it('respond with 404', function() {
        return request(app)
        .get('/error')
        .expect(function(res) {
            res.body.message.should.equal("error");
        });
    });
});

describe('/api/testapi', () => {
    describe('POST /', () => {
        it('/ should resond 400', (done) => {
            request(app)
            .post('/api/testapi')
            .send({ age: 18 })
            .expect((res) => {
                res.body.message.should.equal('need username');
            })
            .expect(400, done)
        })
        it('/ should resond 201 and create supertest', (done) => {
            request(app)
            .post('/api/testapi')
            .send({ username: 'supertest'})
            .expect(201, done)
        })
        it('/supertest should respond 200 and not age', (done) => {
            request(app)
            .get('/api/testapi/supertest')
            .expect((res) => {
                res.body.username.should.equal('supertest');
                (typeof res.body.age).should.equal('undefined');
            })
            .expect(200, done)
        })
        it('/ should resond 201 and create supertest2', (done) => {
            request(app)
            .post('/api/testapi')
            .send({ username: 'supertest2', age: 22 })
            .expect(201, done)
        })
        it('/supertest2 should respond 200', (done) => {
            request(app)
            .get('/api/testapi/supertest2')
            .expect((res) => {
                res.body.username.should.equal('supertest2');
                res.body.age.should.equal(22);
            })
            .expect(200, done)
        })
        it('/ should resond 201', (done) => {
            request(app)
            .post('/api/testapi')
            .send({ username: 'supertest', age: 20})
            .expect((res) => {
                res.body.message.should.equal('username has been created');
            })
            .expect(409, done)
        })
    })
    describe('PUT /', () => {
        it('/ should respond 200', (done) => {
            request(app)
            .put('/api/testapi')
            .send({ username: 'supertest', age: 23 })
            .expect(200, done)
        })
        it('/supertest should respond 200 and age changed', (done) => {
            request(app)
            .get('/api/testapi/supertest')
            .expect((res) => {
                res.body.username.should.equal('supertest');
                res.body.age.should.equal(23);
            })
            .expect(200, done)
        })
        it('/ should resond 404 can not find user', (done) => {
            request(app)
            .put('/api/testapi')
            .send({ username: 'supertest3', age: 25 })
            .expect((res) => {
                res.body.message.should.equal('can not find user: supertest3');
            })
            .expect(404, done)
        })
        it('/ should resond 400 need username', (done) => {
            request(app)
            .put('/api/testapi')
            .send({ age: 18 })
            .expect((res) => {
                res.body.message.should.equal('need username');
            })
            .expect(400, done)
        })
    })
    describe('GET /', () => {
        let data;
        before(() => {
            try {
                data = fs.readFileSync('data.json');
                data = JSON.parse(data);
            } catch (err) {
                data = []
            }
        })
        it('/ should respond 200 and all data', (done) => {
            request(app)
            .get('/api/testapi')
            .expect((res) => {
                JSON.stringify(res.body).should.equal(JSON.stringify(data));
            })
            .expect(200, done)
        })
        it('/?username=supertest should respond 200 and supertest\'s data', (done) => {
            request(app)
            .get('/api/testapi/?username=supertest')
            .expect((res) => {
                res.body.username.should.equal('supertest');
                res.body.age.should.equal(23);
            })
            .expect(200, done)
        })
        it('/?username=zhangsan should respond 404 and no data', (done) => {
            request(app)
            .get('/api/testapi/?username=zhangsan')
            .expect((res) => {
                res.body.message.should.equal('can not find user: zhangsan');
            })
            .expect(404, done)
        })
        it('/?q=supertest should respond 400', (done) => {
            request(app)
            .get('/api/testapi/?q=supertest')
            .expect((res) => {
                res.body.message.should.equal('some wrong with query');
            })
            .expect(400, done)
        })
    })
    describe('GET /:id', () => {
        it('/supertest should respond 200 and supertest\'s data', (done) => {
            request(app)
            .get('/api/testapi/supertest')
            .expect((res) => {
                res.body.username.should.equal('supertest');
                res.body.age.should.equal(23);
            })
            .expect(200, done)
        })
        it('/zhangsan should respond 404 and no data', (done) => {
            request(app)
            .get('/api/testapi/zhangsan')
            .expect((res) => {
                res.body.message.should.equal('can not find user: zhangsan');
            })
            .expect(404, done)
        })
    })
    describe('DELETE /', () => {
        it('/ should respond 200 delete supertest', (done) => {
            request(app)
            .delete('/api/testapi')
            .send({ username: 'supertest'})
            .expect(200, done)
        })
        it('/?username=supertest', (done) => {
            request(app)
            .get('/api/testapi/?username=supertest')
            .expect((res) => {
                res.body.message.should.equal('can not find user: supertest');
            })
            .expect(404, done)
        })
        it('/ should respond 200 delete supertest2', (done) => {
            request(app)
            .delete('/api/testapi')
            .send({ username: 'supertest2'})
            .expect(200, done)
        })
        it('/ should resond 404 can not find user', (done) => {
            request(app)
            .put('/api/testapi')
            .send({ username: 'supertest3'})
            .expect((res) => {
                res.body.message.should.equal('can not find user: supertest3');
            })
            .expect(404, done)
        })
        it('/ should resond 400 need username', (done) => {
            request(app)
            .put('/api/testapi')
            .send({ age: 25 })
            .expect((res) => {
                res.body.message.should.equal('need username');
            })
            .expect(400, done)
        })
    })
})
