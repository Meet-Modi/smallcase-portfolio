// Function for checking lowercase of tickersymbol, integer format of quantity and number format
// of price and if BUY AND SELL is only passed in the parameters. If not true, will reject the user 
// request.
const checkUpdateRequest = async function(req,res,next){
    
    var TradeData = req.body;
    if(Number.isInteger(TradeData.tradeId)){
        if(TradeData.tradeType == "Buy" || TradeData.tradeType == "Sell"){
            if(Number.isInteger(TradeData.Quantity)){
                if(typeof(TradeData.unitPrice)=='number'){
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