const express = require('express')
const router = express.Router()

const securitycontroller = require('../controllers/securityController')
const portfoliocontroller = require('../controllers/portfolioController')
const tradecontroller = require('../controllers/tradeController')

const TradeModel = require('../models/trade')
const PortfolioModel = require('../models/portfolio')

const deleteTradeValidator = require('../middlewares/deleteTradeValidator')
const updateTradeValidator = require('../middlewares/updateTradeValidator')


var trade_counter = 0;
async function getLatestTradeId() {
    try{
    trade_counter = await TradeModel.find({}).sort({_id:-1}).limit(1);
    trade_counter = trade_counter[0].tradeId;
    }
    catch(err){
        trade_counter = 0;
    }
    console.log("Last TradeId : " + trade_counter);
}setTimeout(getLatestTradeId, 6000);



router.get('/fetch',tradecontroller.fetchAllTrades);
router.post('/delete',deleteTradeValidator.checkDeleteRequest,tradecontroller.DeleteTrade);
router.put('/update',updateTradeValidator.checkUpdateRequest,tradecontroller.UpdateTrade);


router.post('/add',async function(req,res){
    TradeData_old = req.body;
    TradeData = await validate(TradeData_old);
    if(await securitycontroller.check_if_security_exists(TradeData.tickerSymbol)){
        trade = new TradeModel(TradeData);
        await trade.save();
        await portfoliocontroller.updatePortfolio(trade);
        res.send("recieved the request");
    }
    else
        res.send("Invalid trade, security does not exist");
    
});

async function validate(TradeData){
    if(TradeData.tradeType == "Sell"){
        var Portfoliodata = await PortfolioModel.find({tickerSymbol : TradeData.tickerSymbol});
        Portfoliodata = Portfoliodata[0];
        if(Portfoliodata.Quantity >= TradeData.quantity){
            console.log("Sell authorised");
        }
        else{
            console.log("invalid trade");
            throw "invalid";
        }
    }
    
    TradeData.tradeId = ++trade_counter;
    TradeData.txnAmount = TradeData.unitPrice * TradeData.quantity;
    TradeData.timestamp = new Date();
    return TradeData;
}

module.exports = router;

