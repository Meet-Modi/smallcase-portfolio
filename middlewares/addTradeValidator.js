function addTradeValidator(req,res,next){
    var data = req.body;
    if(Number.isInteger(data.quantity)){
        if(isUpperCase(data.tickerSymbol)){
            if(typeof(data.unitPrice)=='number'){
                if(data.tradeType == "Buy" || data.tradeType == "Sell"){
                    next();
                }
                else
                    res.status(500).send({message : "Request rejected. Possible reasons can be lowercase tickersymbol or quantity is not an integer or unitprice is not a number"})
            }
            else
                res.status(500).send({message : "Request rejected. Possible reasons can be lowercase tickersymbol or quantity is not an integer or unitprice is not a number"})
        }
        else
            res.status(500).send({message : "Request rejected. Possible reasons can be lowercase tickersymbol or quantity is not an integer or unitprice is not a number"})
    }
    else
        res.status(500).send({message : "Request rejected. Possible reasons can be lowercase tickersymbol or quantity is not an integer or unitprice is not a number"})
}

function isUpperCase(str) {
    return str === str.toUpperCase();
}

module.exports = {
    addTradeValidator
}