const TradeModel = require('../models/trade')
const SecurityModel = require('../models/security')
const PortfolioModel = require('../models/portfolio')

const PortfolioController = require('../controllers/portfolioController');
const SecurityController = require('../controllers/securityController')

const utility = require('../helpers/utilities')
const avg_cost = require('../helpers/calculate_avg_cost');
const { response } = require('express');

/*
Controller function for inserting trades in the trade table and also updating the portfolio
quantity and also averagecost for holding.
Negative stock validation is implemented in the function
*/ 
const InsertTrades = async function(req,res){
    try{
        var TradeData = req.body;
        var trade_counter = await TradeModel.find({}).sort({_id:-1}).limit(1);
        trade_counter = trade_counter[0].tradeId;
        TradeData.tradeId = ++trade_counter;
        TradeData.txnAmount = TradeData.unitPrice * TradeData.quantity;
        TradeData.timestamp = new Date();

        
        if(await SecurityController.CheckIfSecurityExists(TradeData.tickerSymbol)){
            if(TradeData.tradeType == "Sell"){
                var Portfoliodata = await PortfolioController.fetchcurrentPortfolioByTicker(TradeData.tickerSymbol);
                if(Portfoliodata.Quantity>0){
                    if(Portfoliodata.Quantity >= TradeData.quantity){
                        console.log({message: "Sell authorised"});
                    }
                    else{
                        res.status(500).send({message:"Insufficient funds for sell order"})
                        return;
                    }    
                }
                else{
                    res.status(500).send({message:"No funds exists for this security!"})
                    return;
                }
            }
            
            trade = new TradeModel(TradeData);
            await trade.save();
            await PortfolioController.updatePortfolio(trade);
            res.status(200).send({message:"Trade added successfully!"});
            return;
        }
        else
            res.status(500).send({message:"Invalid Trade This security does not exist!"});
            return;
    }
    catch(err){
        res.status(500).send({message:err});
        return;
    }
}

/*
Controller function to fetch all trades for each respective holdings
*/
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
        res.status(200).send(trades);
    }
    catch(err){
        res.status(500).send({ message: `fetching of securities failed.`})
    }
}
/*


/*
Function to update the past trades. Entities such as 
TradeType(Buy->Sell) & (Sell->Buy)
Quantity (increase ) & (Decrease)
unitPrice (increase ) & (Decrease) can be updated simultaneously.
If any posssibility of negative stock holding is there. Update will be rejected.
Otherwise it will be updated.
*/
const UpdateTrade = async function(req,res){
    try{
        var TradeData = req.body;
        var old_trade = await fetchTradeByTradeId(TradeData.tradeId);
        old_trade = old_trade[0];
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
                    res.status(500).send({message : "Insufficient Funds available for sell"});
                    return;
                }
            }
            else{
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
                    res.status(500).send({message : "Insufficient Funds available for update"});
                    return;
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
                res.status(500).send({message : "No such TradeType is possible"});
                return;
            }
        }
        else{
            console.log("No such case possible");
            res.status(500).send({message : "No such update is possible"});
            return;
        }
        var txnAmt = TradeData.unitPrice * TradeData.Quantity;
        await TradeModel.findByIdAndUpdate(Updated_trade._id,{tradeType:TradeData.TradeType,unitPrice:TradeData.unitPrice,quantity:TradeData.Quantity,txnAmount:txnAmt});
        
        await PortfolioModel.findByIdAndUpdate(updated_portfolio._id,{averageCost:updated_portfolio.averageCost ,Quantity :  updated_portfolio.Quantity})
        
        res.status(200).send(updated_portfolio);
        return;
    }
    catch(err){
        res.status(500).send(err);
        return;
    }
}
/*
Function for deleting the trades (Buy/Sell) both.
Negative Stock Holding Validation has been implemented
in case it pass, then only trade will be deleted.
Else the request will be rejected.
*/
const DeleteTrade = async function(req,res){
    try{
        var TradeData = await fetchTradeByTradeId(req.body.tradeId);
        TradeData = TradeData[0];
        var current_portfolio = await PortfolioController.fetchcurrentPortfolioByTicker(TradeData.tickerSymbol);
        var id = current_portfolio._id;
    
        if(TradeData.tradeType == "Buy"){
            if(current_portfolio.Quantity >= TradeData.quantity){
                new_portfolio = utility.removeBuyTradesInPortfolio(current_portfolio, TradeData);
                await PortfolioModel.findByIdAndUpdate(id,{averageCost:new_portfolio.averageCost ,Quantity :  new_portfolio.Quantity});
                await TradeModel.deleteOne({tradeId : TradeData.tradeId});
                res.status(200).send({message : "Buy Trade Delete Success!"});
                return;
            }
            else{
                console.log("Invalid Delete!");
                res.status(500).send({message: "Conflict! negative portfolio possibility"});
                return;
            }
        }
        else if(TradeData.tradeType == "Sell"){
            new_portfolio = utility.removeSellTradesInPortfolio(current_portfolio,TradeData);
            console.log(new_portfolio);
            await PortfolioModel.findByIdAndUpdate(id,{averageCost:new_portfolio.averageCost ,Quantity :  new_portfolio.Quantity});
            await TradeModel.deleteOne({tradeId : TradeData.tradeId});
            res.status(200).send({message : "Sell Trade Delete Success!"});
            return;
        }
        else{
            res.status(500).send({message:"Invalid Trade Type"});
            return;
        }   
    }
    catch(err){
        res.status(500).send({message : "Please check the trade details"});
    }
}

/*
    Fucntion for fetching trade row by TradeId
*/
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
/*
function to get all by tickerSymbol
*/
const fetchAllTradesByTicker = async function(tickerSymbol){
    try{
        var data = await SecurityModel.find();
        console.log(data);
        res.status(200).send(data);
    }
    catch(err){
        throw { message: `fetching of securities failed.`}
    }
}

module.exports = {
    InsertTrades,
    fetchAllTrades,
    fetchAllTradesByTicker,
    fetchTradeByTradeId,
    DeleteTrade,
    UpdateTrade
}


