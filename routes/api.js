'use strict';
const {
  fetch,
  setGlobalDispatcher,
  Agent,
} = require('undici')

setGlobalDispatcher(new Agent({
  connect: {
    rejectUnauthorized: false
  }
}))

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, {
  tls: true,
  tlsAllowInvalidCertificates: true,
})

const symbolSchema = new mongoose.Schema({
    symbol: { type: String},
    likedIps: { type: Array, items: { type: String }},
    likeCount: { type: Number, default: 1 }
});
const Symbol = mongoose.model('Symbol', symbolSchema);

async function stockFetch(stock, likeInput, clientIp) {
  const output = [];
  const symbolArray = [];
  let like;
  if (likeInput === 'true'){
    like = true;
  }else{
    like = false;
  }
  if (stock.length == 2){ //Pair of stock symbols
    symbolArray.push([stock[0]]);
    symbolArray.push([stock[1]]);
  }else{  //Single stock symbol
    symbolArray.push([stock]);
  }
  for (let i = 0; i < symbolArray.length; i++){
    let likeCount;
    let latestPrice;
    let nameAndPrice;
    const symbol = symbolArray[i].toString().toUpperCase();
    await Symbol.find({ symbol: symbol }).then(data => {
      if (like){
        if (!data[0]){
          likeCount = 1;
          const newSymbol = new Symbol({
            symbol: symbol,
            likedIps: [clientIp]
          });
          newSymbol.save()
        }else {
          if ((data[0].likedIps).includes(clientIp)){
            likeCount = data[0].likeCount
          }else{
            likeCount = data[0].likeCount++;
            Symbol.updateOne({ id: data._id }, { $push: { likedIps: clientIp}, likeCount: data.likeCount++})
          };
        };
      }else {
        if (!data[0]){
          likeCount = 0;
        }else {
          likeCount =  data[0].likeCount;
        };
      }
    });
    let url = 'https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/' + symbol + '/quote';
    //process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
    await fetch(url)
      .then(response => response.json())
      .then(response => {
        if (response == "Invalid symbol"){
          output.push({
            error: "invalid symbol",
            likes: likeCount
          })
        }else{
          output.push({
            stock: response.symbol,
            price: response.latestPrice,
            likes: likeCount
          })
        }
      })
    if (output.length == symbolArray.length){
      if (output.length == 1){
        return output[0]
      }else{
        if (output[0].likes >= output[1].likes){
          return [
            {
              stock: output[0].stock,
              price: output[0].price,
              rel_likes: output[0].likes - output[1].likes
            },
            {
              stock: output[1].stock,
              price: output[1].price,
              rel_likes: output[1].likes - output[0].likes
            }
          ]
        }else {
          return [
            {
              stock: output[0].stock,
              price: output[0].price,
              rel_likes: output[1].likes - output[0].likes
            },
            {
              stock: output[1].stock,
              price: output[1].price,
              rel_likes: output[0].likes - output[1].likes
            }
          ]
        }
      }
    }    
  }
}

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(async function (req, res){
      const response = await stockFetch(req.query.stock, req.query.like, req.ip)
      console.log(req.query.stock, req.query.like, response)
      res.json({
        stockData: response
      });
    });
}
