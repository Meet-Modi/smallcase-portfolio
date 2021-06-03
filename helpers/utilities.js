const avg_cost = require('./calculate_avg_cost');

const GetCurrentPriceTicker = async function(tickerSymbol){
    var CurrentPrice = 100;
    return CurrentPrice;
}

const CalculatePnL = async function(portfolio){
    var currentPrice = await GetCurrentPriceTicker(portfolio.ticker);
    var AvgCost = portfolio.averageCost;
    var Quantity = portfolio.Quantity;
    return (currentPrice - AvgCost)*Quantity;
}

function addBuyTradesInPortfolio(old_portfolio,trade){
    var updated_portfolio = {};

    updated_portfolio.tickerSymbol = old_portfolio[0].tickerSymbol;
    updated_portfolio.Quantity = parseFloat(old_portfolio[0].Quantity) + parseFloat(trade.quantity);
    updated_portfolio.averageCost = avg_cost.GetNewAvgCost(old_portfolio[0],trade);
    
    return updated_portfolio;
}

function addSellTradesInPortfolio(old_portfolio,trade){
    var updated_portfolio = {};
    
    updated_portfolio.tickerSymbol = old_portfolio[0].tickerSymbol;
    updated_portfolio.Quantity = parseFloat(old_portfolio[0].Quantity) - parseFloat(trade.quantity);
    updated_portfolio.averageCost = old_portfolio[0].averageCost;
    
    return updated_portfolio;
}

function removeBuyTradesInPortfolio(old_portfolio,trade){
    var updated_portfolio = {};
    
    updated_portfolio.tickerSymbol = old_portfolio.tickerSymbol;
    updated_portfolio.Quantity = parseFloat(old_portfolio.Quantity) - parseFloat(trade.quantity);
    updated_portfolio.averageCost = avg_cost.RevertAvgCost(old_portfolio,trade);

    return updated_portfolio;
}

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