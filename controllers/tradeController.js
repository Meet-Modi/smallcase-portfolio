const TradeModel = require('../models/trade')
const SecurityModel = require('../models/security')
const PortfolioModel = require('../models/portfolio')
const PortfolioController = require('../controllers/portfolioController');
const utility = require('../helpers/utilities')
const avg_cost = require('../helpers/calculate_avg_cost');

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

const UpdateTrade = async function(req,res){
    try{
        var TradeData = req.body;
        var old_trade = await fetchTradeByTradeId(TradeData.tradeId);
        old_trade = old_trade[0];
        console.log("OLD TRADE 0   " +old_trade);
        var old_portfolio = await PortfolioController.fetchcurrentPortfolioByTicker(old_trade.tickerSymbol);
        var updated_portfolio = JSON.parse(JSON.stringify(old_portfolio));
        var Updated_trade = JSON.parse(JSON.stringify(old_trade));

        Updated_trade.quantity = TradeData.Quantity;
        Updated_trade.tradeType = TradeData.TradeType;
        Updated_trade.unitPrice = TradeData.unitPrice;

        if(Updated_trade.tradeType !==  old_trade.tradeType){
            if(old_trade.tradeType == "Buy"){
                if(old_portfolio.Quantity - old_trade.quantity - Updated_trade.quantity >= 0){
                    updated_portfolio.Quantity = old_portfolio.Quantity - old_trade.quantity - Updated_trade.quantity;
                    updated_portfolio.averageCost = avg_cost.RevertAvgCost(old_portfolio,old_trade);
                    console.log("in buy to sell");
                }
                else{
                    console.log("Not possible buy to sell");
                }
            }
            else{
                /* Sell to Buy */
                updated_portfolio.averageCost = avg_cost.GetNewAvgCost(old_portfolio,old_trade);
                updated_portfolio.Quantity = old_portfolio.Quantity + old_trade.quantity;

                updated_portfolio.averageCost = avg_cost.GetNewAvgCost(updated_portfolio,Updated_trade);
                updated_portfolio.Quantity = updated_portfolio.Quantity + Updated_trade.quantity;
            }
        }
        else if(Updated_trade.tradeType ==  old_trade.tradeType){
            if(Updated_trade.tradeType == "Buy"){
                if(old_portfolio.Quantity - old_trade.quantity + Updated_trade.quantity >= 0){
       
                    updated_portfolio.averageCost = avg_cost.RevertAvgCost(old_portfolio,old_trade);
                    updated_portfolio.Quantity = old_portfolio.Quantity - old_trade.quantity;
                    
                    updated_portfolio.averageCost = avg_cost.GetNewAvgCost(updated_portfolio,Updated_trade);
                    updated_portfolio.Quantity = updated_portfolio.Quantity + Updated_trade.quantity;
                    
                    console.log("in Buy Quantity update case");
                }
                else{
                    console.log("Not possible");
                }
            }
            else if(Updated_trade.tradeType == "Sell"){
                if(old_portfolio.Quantity + old_trade.quantity - Updated_trade.quantity >= 0){
                    updated_portfolio.Quantity = old_portfolio.Quantity + old_trade.quantity - Updated_trade.quantity;
                    console.log("in Sell Quantity update case");
                }
            }
            else{
                console.log("No such case possible");
            }
        }
        else{
            console.log("No such case possible");
        }
        res.send(updated_portfolio);
    }
    catch(err){
        res.send(err);
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
    DeleteTrade,
    UpdateTrade
}


