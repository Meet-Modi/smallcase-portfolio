const { isValidObjectId } = require('mongoose');
const utilities = require('../helpers/utilities');
const PortfolioModel = require('../models/portfolio');
/*
This function fetches the whole portfolio from the collection
*/
const fetchcurrentPortfolio = async function(req,res){
    try{
        var data = await PortfolioModel.find();
        var portfolio = [];
        for(let i=0;i<data.length;i++){
            portfolio.push({ticker:data[i].tickerSymbol,Quantity:data[i].Quantity,averageCost:data[i].averageCost});
        }
        res.status(200).send(portfolio);
    }
    catch(err){
        res.status(500).send({ message: `fetching of portfolio failed.` });
    }
}
/*
This function fetches the row of the portfolio for particular ticker
*/
const fetchcurrentPortfolioByTicker = async function(ticker){
    try{
        var Portfoliodata = await PortfolioModel.find({tickerSymbol : ticker});
        if(Portfoliodata.length > 0){
            return Portfoliodata[0];
        }
        else{
            return [];
        }
    }
    catch(err){
        return [];
    }
}
/*
Function to update the Portfolio which would call the utilities functions
for adding new Trades in the system.
*/
const updatePortfolio = async function(trade){
    var ticker = trade.tickerSymbol;
    var Newportfolio = {};
    try{
        var Portfoliodata = await PortfolioModel.find({tickerSymbol : ticker});
        if(Portfoliodata.length > 0){
            if(trade.tradeType == "Buy"){
                var id = Portfoliodata[0]._id;
                Newportfolio = utilities.addBuyTradesInPortfolio(Portfoliodata,trade);
                await PortfolioModel.findByIdAndUpdate(id,{averageCost:Newportfolio.averageCost ,Quantity :  Newportfolio.Quantity});
            }
            else if(trade.tradeType == "Sell"){
                console.log("in sell");
                var id = Portfoliodata[0]._id;
                if(Portfoliodata[0].Quantity >= trade.quantity){
                    Newportfolio = utilities.addSellTradesInPortfolio(Portfoliodata,trade);
                    await PortfolioModel.findByIdAndUpdate(id,{averageCost:Newportfolio.averageCost ,Quantity :  Newportfolio.Quantity});        
                }
                else{
                    console.log("insufficient funds!");
                }
            }
        } 
        else{
            if(trade.tradeType == "Buy"){
                var portfolio_row = {};
                portfolio_row.tickerSymbol = ticker;
                portfolio_row.Quantity = trade.quantity;
                portfolio_row.averageCost = trade.unitPrice;
                portfolioForTicker = new PortfolioModel(portfolio_row);
                await portfolioForTicker.save();
            } 
            else{
                throw { message: `Insufficient Funds!`, status: 500 };
            }
        }
    }
    catch(err){
        res.status(500).send({ message: `fetching of portfolio failed.` });
    }
}
/*
Controller function for integrating utilites and Model data to calculate
returns (PnL : Profit and Loss)
*/
const fetchPnL = async function(req,res){
    try{
        var data = await PortfolioModel.find();
        var portfolio = [];
        for(let i=0;i<data.length;i++){
            var PnL = await utilities.CalculatePnL({ticker:data[i].tickerSymbol,Quantity:data[i].Quantity,averageCost:data[i].averageCost});
            portfolio.push({ticker:data[i].tickerSymbol,Quantity:data[i].Quantity,averageCost:data[i].averageCost,returns:PnL});
        }
        res.status(200).send(portfolio);
    }
    catch(err){
        res.status(500).send({ message: `fetching of portfolio failed.` });
    }
}


module.exports = {
    fetchcurrentPortfolio,
    updatePortfolio,
    fetchPnL,
    fetchcurrentPortfolioByTicker
};