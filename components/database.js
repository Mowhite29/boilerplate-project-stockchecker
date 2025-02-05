const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, { tls: true })

const symbolSchema = new mongoose.Schema({
    symbol: { type: String},
    likedIps: { type: Array, items: { type: String }},
    likeCount: { type: Number, default: 1 }
})

const Symbol = mongoose.model('Symbol', symbolSchema)

class SymbolDB{
    input(symbolInput, like, clientIp) {
        if (symbolInput.length == 2){ //Pair of stock symbols
            const symbol0 = symbolInput[0];
            const symbol1 = symbolInput[1];
    
    
        }else{  //Single stock symbol
            const symbol = symbolInput;
            let url = 'https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/' + symbol + '/quote';
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
            fetch(url)
                .then(response => response.json())
                .then(response => {
                    console.log(response.symbol, response.latestPrice)
                    console.log(like)
                    if (like){
                        console.log('like')
                        this.newLike(response.symbol, clientIp, response.latestPrice)
                    }else {
                        console.log('not like')
                        this.getLike(symbol, response.latestPrice);
                    }
                })
        }
    }

    newLike(symbolInput, ipAddress, latestPrice) {
        Symbol.find({ symbol: symbolInput }).then(data => {
            if (!data[0].symbol){
                const newSymbol = new Symbol({
                    symbol: symbolInput,
                    likedIps: [ipAddress]
                });
                newSymbol.save().then(response => {
                    console.log({
                        stockData: {
                            stock: symbolInput,
                            price: latestPrice,
                            likes: 1
                        }
                    })
                    return {
                        stockData: {
                        stock: symbolInput,
                        price: latestPrice,
                        likes: 1
                        }
                    };
                });
            }else {
                if ((data[0].likedIps).includes(ipAddress)){
                    console.log({
                        stockData: {
                            stock: symbolInput,
                            price: latestPrice,
                            likes: data[0].likeCount
                        }
                    })
                    return {
                        stockData: {
                        stock: symbolInput,
                        price: latestPrice,
                        likes: data[0].likeCount
                        }
                    };
                }else{
                    Symbol.updateOne({ id: data._id }, { $push: { likedIps: ipAddress}, likeCount: data.likeCount++}).then(response => {
                        console.log({
                            stockData: {
                                stock: symbolInput,
                                price: latestPrice,
                                likes: data[0].likeCount++
                            }
                        })
                        return {
                            stockData: {
                            stock: symbolInput,
                            price: latestPrice,
                            likes: data[0].likeCount++
                            }
                        };
                    });
                };
            };
        })
    };

    getLike(symbolInput, latestPrice){
        Symbol.find({ symbol: symbolInput }).then(data => {
            let likeCount
            if (!data.likeCount){
                console.log(1)
                likeCount = 0;
            }else {
                likeCount =  data.likeCount;
            };
            console.log(likeCount)
            console.log({stockData: {
                stock: symbolInput,
                price: latestPrice,
                likes: likeCount
            }})
            return {
                stockData: {
                    stock: symbolInput,
                    price: latestPrice,
                    likes: likeCount
                }
            };
        });
    }
}

module.exports = SymbolDB;