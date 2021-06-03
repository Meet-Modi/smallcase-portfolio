const TradeModel = require('../models/trade')
const PortfolioController = require('../controllers/portfolio');


const fetchAllTrades = async function(req,res){
    console.log("in sec. controller");
    try{
        var data = await SecurityModel.find();
        console.log(data);
        res.send(data);
    }
    catch(err){
        throw { message: `fetching of securities failed.`}
    }
}

const fetchAllTradesByTicker = async function(tickerSymbol){
    console.log("in trade controller");
    try{
        var data = await TradeModel.find({})
    }
}

insertTrades = async function(tradeData){
    var portfolio = await PortfolioController.fetchcurrent(); 
    console.log(portfolio);
} 