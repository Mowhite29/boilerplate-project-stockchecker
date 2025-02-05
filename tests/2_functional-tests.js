const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let firstLikeResponse;

suite('Functional Tests', function() {
    test('1. Viewing one stock: GET request to /api/stock-prices/', (done) => {
        chai.request(server)
        .get('/api/stock-prices?stock=GOOG')
        .end((err, res) => {
            assert.isNumber(res.body.stockData.price);
            firstLikeResponse = parseInt(res.body.stockData.likes);
            done();
        })
    })
    test('2. Viewing one stock and liking it: GET request to /api/stock-prices/', (done) => {
        chai.request(server)
        .get('/api/stock-prices?stock=GOOG&like=true')
        .end((err, res) => {
            assert.isNumber(res.body.stockData.price);
            assert.equal(res.body.stockData.likes, (firstLikeResponse + 1));
            done();
        })
    })
    test('3. Viewing the same stock and liking it again: GET request to /api/stock-prices/', done => {
        chai.request(server)
        .get('/api/stock-prices?stock=GOOG&like=true')
        .end((err, res) => {
            assert.isNumber(res.body.stockData.price);
            assert.equal(res.body.stockData.likes, firstLikeResponse + 1);
            done();
        })
    })
    test('4. Viewing two stocks: GET request to /api/stock-prices/', done => {
        chai.request(server)
        .get('/api/stock-prices?stock=G&stock=MSFT')
        .end((err, res) => {
            assert.isNumber(res.body.stockData[0].price);
            assert.isNumber(res.body.stockData[1].price);
            done();
        })
    })
    test('5. Viewing two stocks and liking them : GET request to /api/stock-prices/', done => {
        chai.request(server)
        .get('/api/stock-prices?stock=G&stock=MSFT&like=true')
        .end((err, res) => {
            assert.isNumber(res.body.stockData[0].price);
            assert.isNumber(res.body.stockData[1].price);
            assert.equal(res.body.stockData[0].likes, res.body.stockData[1].likes);
            done();
        })
    })
});
