const { isValidObjectId } = require('mongoose');
const utilities = require('../helpers/utilities');
const PortfolioModel = require('../models/portfolio');

async function fetchcurrent(){
    try{
        var data = await PortfolioModel.find({});
        console.log(data);
        return data;
    }
    catch(err){
        throw { message: `fetching of portfolio failed.` }
    }
}

async function updatePortfolio(trade){
    var ticker = trade.tickerSymbol;
    var Newportfolio = {};
    try{
        var Portfoliodata = await PortfolioModel.find({tickerSymbol : ticker});
        console.log(Portfoliodata.length);
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
                portfolio_row.averageCost = trade.txnAmount;
                portfolioForTicker = new PortfolioModel(portfolio_row);
                await portfolioForTicker.save();
            } 
            else{
                throw { message: `Insufficient Funds!`, status: 400 };
            }
        }

    }
    catch(err){

    }
}



module.exports = {
    fetchcurrent,
    updatePortfolio
};