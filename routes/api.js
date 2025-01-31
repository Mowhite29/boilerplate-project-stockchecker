'use strict';
const requestIp = require('request-ip');

const SymbolDB = require('../components/database.js');

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res){
      if (req.query.stock.length == 2){ //Pair of stock symbols
        const symbol0 = req.query.stock[0];
        const symbol1 = req.query.stock[1];
      }else{  //Single stock symbol
        const symbol = req.query.stock;
        if (req.query.like){
          const clientIp = requestIp.getClientIp(req);
          let url = 'https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/' + symbol + '/quote';
          process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
          fetch(url)
            .then(response =>response.json())
            .then(response => {
            console.log(response.symbol, response.latestPrice)
            })
          
        }else {
          
        }
      }
    });
    
};
