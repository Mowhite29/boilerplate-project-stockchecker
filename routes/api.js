'use strict';
const requestIp = require('request-ip');

const SymbolDB = require('../components/database');
const stockAPI = require('../components/stock-api');

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res){
      console.log(req.query.stock)
      console.log(req.query.like)
      if (req.query.stock.length == 2){ //Pair of stock symbols
        const symbol0 = req.query.stock[0];
        const symbol1 = req.query.stock[1];
      }else{  //Single stock symbol
        const symbol = req.query.stock;
        if (req.query.like){
          const clientIp = requestIp.getClientIp(req);
          stockAPI(symbol).then(response => {
            console.log(response)
          })
        }else {
          
        }
      }
    });
    
};
