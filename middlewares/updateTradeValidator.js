// Function for checking lowercase of tickersymbol, integer format of quantity and number format
// of price and if BUY AND SELL is only passed in the parameters. If not true, will reject the user 
// request.

const TradeController = require('../controllers/tradeController');

const checkUpdateRequest = async function(req,res,next){
    
    var TradeData = req.body;
    if(Number.isInteger(TradeData.tradeId)){
        if(TradeData.tradeType == "Buy" || TradeData.tradeType == "Sell"){
            if(Number.isInteger(TradeData.Quantity)){
                if(typeof(TradeData.unitPrice)=='number'){
                    var old_trade = await TradeController.fetchTradeByTradeId(TradeData.tradeId);
                    old_trade = old_trade[0];
                    if(typeof(old_trade) == "undefined")
                        res.status(500).send({message:"Invalid TradeId This Trade does not exist!"});
                    else
                        next();
                }
                else
                    res.status(500).send({message : "Request rejected. Possible reasons can be lowercase tickersymbol or quantity,tradeUd is not an integer or unitprice is not a number"})
            }
            else
            res.status(500).send({message : "Request rejected. Possible reasons can be lowercase tickersymbol or quantity,tradeUd is not an integer or unitprice is not a number"})
        }
        else
        res.status(500).send({message : "Request rejected. Possible reasons can be lowercase tickersymbol or quantity,tradeId is not an integer or unitprice is not a number"})
    }
    else
    res.status(500).send({message : "Request rejected. Possible reasons can be lowercase tickersymbol or quantity,tradeUd is not an integer or unitprice is not a number"})
    
   //next();
}

module.exports = {
    checkUpdateRequest
};