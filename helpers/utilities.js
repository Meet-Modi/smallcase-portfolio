const avg_cost = require('./calculate_avg_cost');

function FindTickerInPortfolio(portfolio,tickerSymbol){
    
}

function addBuyTradesInPortfolio(old_portfolio,trade){
    var updated_portfolio = {};

    updated_portfolio.tickerSymbol = old_portfolio[0].tickerSymbol;
    updated_portfolio.Quantity = parseFloat(old_portfolio[0].Quantity) + parseFloat(trade.quantity);
    updated_portfolio.averageCost = avg_cost.calculate_avg_cost(old_portfolio[0],trade);
        
    return updated_portfolio;
}

function addSellTradesInPortfolio(old_portfolio,trade){
    var updated_portfolio = {};
    
    updated_portfolio.tickerSymbol = old_portfolio[0].tickerSymbol;
    updated_portfolio.Quantity = parseFloat(old_portfolio[0].Quantity) - parseFloat(trade.quantity);
    updated_portfolio.averageCost = old_portfolio[0].averageCost;
    
    return updated_portfolio;
}


module.exports = {
    addBuyTradesInPortfolio,
    addSellTradesInPortfolio
};