const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let firstLikeResponse
let secondLikeResponseOne
let secondLikeResponseTwo

suite('Functional Tests', function() {
    test('Viewing one stock: GET request to /api/stock-prices/', done => {
        chai.request(server)
        .get('api/stock-prices/')
        .send({
            stock: 'GOOG'
        })
        .end((err, res) => {
            assert.isFloat(res.body.stockData.price);
            firstLikeResponse = res.body.likes;
            done();
            })
    })
    test('Viewing one stock and liking it: GET request to /api/stock-prices/', done => {
        chai.request(server)
        .get('api/stock-prices/')
        .send({
            stock: 'GOOG',
            like: true
        })
        .end((err, res) => {
            assert.isFloat(res.body.stockData.price);
            assert.equal(res.body.stockData.likes, firstLikeResponse + 1);
            done();
        })
    })
    test('Viewing the same stock and liking it again: GET request to /api/stock-prices/', done => {
        chai.request(server)
        .get('api/stock-prices/')
        .send({
            stock: 'GOOG',
            like: true
        })
        .end((err, res) => {
            assert.isFloat(res.body.stockData.price);
            assert.equal(res.body.stockData.likes, firstLikeResponse + 1);
            done();
        })
    })
    test('Viewing two stocks: GET request to /api/stock-prices/', done => {
        chai.request(server)
        .get('api/stock-prices/')
        .send({
            stock: 'GOOG',
            stock: 'MSFT',
            like: true
        })
        .end((err, res) => {
            assert.isFloat(res.body.stockData[0].price);
            secondLikeResponseOne = res.body.stockData[0].likes;
            secondLikeResponseTwo = res.body.stockData[1].likes
            assert.isFloat(res.body.stockData[1].price);
            done();
        })
    })
    test('Viewing two stocks and liking them : GET request to /api/stock-prices/', done => {
        chai.request(server)
        .get('api/stock-prices/')
        .send({
            stock: 'GOOG',
            stock: 'MSFT',
            like: true
        })
        .end((err, res) => {
            assert.isFloat(res.body.stockData[0].price);
            assert.isFloat(res.body.stockData[1].price);
            assert.equal(res.body.stockData[0].likes, secondLikeResponseOne + 1);
            assert.equal(res.body.stockData[1].likes, secondLikeResponseTwo + 1);
            done();
        })
    })
});
