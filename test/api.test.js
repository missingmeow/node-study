
require('should');
const request = require('supertest');

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
