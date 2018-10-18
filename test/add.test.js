/**
 * 简单应用 mocha 和 should 的小例子
 */

const should = require('should');
const assert = require('assert');

const add = require('./add');

describe('Array', function() {
    describe('#indexOf()', function() {
        this.slow(100000);
        it('should return -1 when the value is not present', function() {
        [1,2,3].indexOf(4).should.equal(-1);
        });
    });
});


describe('Add caculate', () => {
    describe('#add function', () => {
        it('should return 3 when the params are 1 and 2', () => {
            add.add(1, 2).should.equal(3);
        });
        it('should return undefined when the secode param is string', () => {
            (typeof add.add(1, '2')).should.equal('undefined');
        });
        it('should return undefined when the secode params is null', () => {
            (typeof add.add(1)).should.equal('undefined');
        });
    });
});
