const mongoose = require('mongoose');


const symbolSchema = new mongoose.Schema({
    symbol: { type: String},
    likedIps: { type: Array, items: { type: String }},
    likeCount: { type: Number, default: 1 }
})

const Symbol = mongoose.model('Symbol', symbolSchema)

class SymbolDB{
    newLike(symbolInput, ipAddress) {
        Symbol.find({ symbol: symbolInput}).then(data => {
            if (!data){
                const newSymbol = new Symbol({
                    symbol: symbolInput,
                    likedIps: [ipAddress]
                });
                newSymbol.save().then(response => {
                    return {
                        likeCount: 1
                    };
                });
            }else {
                if ((data.likedIps).includes(ipAddress)){
                    return {
                        likeCount: data.likeCount
                    };
                }else{
                    Symbol.updateOne({ id: data._id }, { $push: { likedIps: ipAddress}, likeCount: data.likeCount++}).then(response => {
                        return {
                            likeCount: data.likeCount++
                        };
                    });
                };
            };
        })
    };

    getLike(symbolInput) {
        Symbol.find({ symbol: symbolInput}).then(data => {
            if (!data){
                return {
                    likeCount: 0
                };
            }else {
                return {
                    likeCount: data.likeCount
                };
            };
        });
    };
}

module.exports = SymbolDB;