const TradeModel = require('../models/trade')
const SecurityModel = require('../models/security')
const PortfolioController = require('../controllers/portfolioController');


const fetchAllTrades = async function(req,res){
    try{
        var data = await SecurityModel.find();
        var trades = {};
        
        for(let i=0;i< data.length;i++){
            var ticker_symbol = data[i].tickerSymbol;
            console.log(ticker_symbol);
            var trade = await TradeModel.find({tickerSymbol : ticker_symbol});
            trades[ticker_symbol] = trade;
        }
        console.log(trades);
        res.send(trades);
    }
    catch(err){
        res.send({ message: `fetching of securities failed.`})
    }
}

const fetchAllTradesByTicker = async function(tickerSymbol){
    try{
        var data = await SecurityModel.find();
        console.log(data);
        res.send(data);
    }
    catch(err){
        throw { message: `fetching of securities failed.`}
    }
}

module.exports = {
    fetchAllTrades,
    fetchAllTradesByTicker
}


/*
{
    "TCS" : [{},{},{}],
    "WIPRO" : [{},{},{}]
}

*/