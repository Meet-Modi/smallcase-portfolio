const TradeModel = require('../models/trade')
const SecurityModel = require('../models/security')
const PortfolioModel = require('../models/portfolio')
const PortfolioController = require('../controllers/portfolioController');
const utility = require('../helpers/utilities')

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

const DeleteTrade = async function(req,res){
    try{
        var TradeData = await fetchTradeByTradeId(req.body.tradeId);
        TradeData = TradeData[0];
        console.log("in delete" + TradeData);
        var current_portfolio = await PortfolioController.fetchcurrentPortfolioByTicker(TradeData.tickerSymbol);
        var id = current_portfolio._id;
    
        if(TradeData.tradeType == "Buy"){
            if(current_portfolio.Quantity >= TradeData.quantity){
                new_portfolio = utility.removeBuyTradesInPortfolio(current_portfolio, TradeData);
                console.log(new_portfolio);
                await PortfolioModel.findByIdAndUpdate(id,{averageCost:new_portfolio.averageCost ,Quantity :  new_portfolio.Quantity});
                await TradeModel.deleteOne({tradeId : TradeData.tradeId});
                res.send("Buy Delete Authorised!");
            }
            else{
                console.log("Invalid Delete!");
                res.send("Invalid Delete!");
            }
        }
        else if(TradeData.tradeType == "Sell"){
            new_portfolio = utility.removeSellTradesInPortfolio(current_portfolio,TradeData);
            console.log(new_portfolio);
            await PortfolioModel.findByIdAndUpdate(id,{averageCost:new_portfolio.averageCost ,Quantity :  new_portfolio.Quantity});
            await TradeModel.deleteOne({tradeId : TradeData.tradeId});
            res.send("Sell Delete Authorised!");
        }
    }
    catch(err){
        console.log(err);
        res.send({message : err});
    }
}

const fetchTradeByTradeId = async function(tradeid){
    try{
        var data = await TradeModel.find({tradeId: tradeid});
        console.log(data);
        return data;
    }
    catch(err){
        throw {message: "invalid TradeId"}
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
    fetchAllTradesByTicker,
    fetchTradeByTradeId,
    DeleteTrade
}


