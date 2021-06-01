const TradeModel = require('../models/trade')
const PortfolioController = require('../controllers/portfolio');

async function insertTrades(tradeData){
    var portfolio = await PortfolioController.fetchcurrent(); 
    console.log(portfolio);
}