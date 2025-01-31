'use strict';
const requestIp = require('request-ip');

const SymbolDB = require('../components/database');
const stockAPI = require('../components/stock-api');

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res){
      if (req.params.like){
        const clientIp = requestIp.getClientIp(req);
      }else {
        
      }
    });
    
};
