const avg_cost = require('./calculate_avg_cost');
/*
This function returns the current price of the security
*/
const GetCurrentPriceTicker = async function(tickerSymbol){
    var CurrentPrice = 100;
    return CurrentPrice;
}

/*
This function calculates the Current Profir and Loss of the portfolio based 
on the current price. i.e unrealised gains/returns in the portfolio.
*/
const CalculatePnL = async function(portfolio){
    var currentPrice = await GetCurrentPriceTicker(portfolio.ticker);
    var AvgCost = portfolio.averageCost;
    var Quantity = portfolio.Quantity;
    return (currentPrice - AvgCost)*Quantity;
}

//This function updates the portfolio row for the respective Buy trade

function addBuyTradesInPortfolio(old_portfolio,trade){
    var updated_portfolio = {};

    updated_portfolio.tickerSymbol = old_portfolio[0].tickerSymbol;
    updated_portfolio.Quantity = parseFloat(old_portfolio[0].Quantity) + parseFloat(trade.quantity);
    updated_portfolio.averageCost = avg_cost.GetNewAvgCost(old_portfolio[0],trade);
    
    return updated_portfolio;
}

//This function updates the portfolio row for the respective Sell trade

function addSellTradesInPortfolio(old_portfolio,trade){
    var updated_portfolio = {};
    
    updated_portfolio.tickerSymbol = old_portfolio[0].tickerSymbol;
    updated_portfolio.Quantity = parseFloat(old_portfolio[0].Quantity) - parseFloat(trade.quantity);
    updated_portfolio.averageCost = old_portfolio[0].averageCost;
    
    return updated_portfolio;
}

//This function updates the portfolio row for the removed respective Buy trade

function removeBuyTradesInPortfolio(old_portfolio,trade){
    var updated_portfolio = {};
    
    updated_portfolio.tickerSymbol = old_portfolio.tickerSymbol;
    updated_portfolio.Quantity = parseFloat(old_portfolio.Quantity) - parseFloat(trade.quantity);
    updated_portfolio.averageCost = avg_cost.RevertAvgCost(old_portfolio,trade);

    return updated_portfolio;
}

//This function updates the portfolio row for the removed respective Sell trade

function removeSellTradesInPortfolio(old_portfolio,trade){
    var updated_portfolio = {};

    updated_portfolio.tickerSymbol = old_portfolio.tickerSymbol;
    updated_portfolio.Quantity = parseFloat(old_portfolio.Quantity) + parseFloat(trade.quantity);
    updated_portfolio.averageCost = old_portfolio.averageCost;

    return updated_portfolio;
}

module.exports = {
    addBuyTradesInPortfolio,
    addSellTradesInPortfolio,
    GetCurrentPriceTicker,
    CalculatePnL,
    removeBuyTradesInPortfolio,
    removeSellTradesInPortfolio
};