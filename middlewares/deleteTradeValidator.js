// Function for integer format of tradeId
// passed in the parameters. If not true, will reject the user request.
const checkDeleteRequest = async function(req,res,next){
    var TradeData = req.body;
    if(Number.isInteger(Tradedata.tradeId)){
        next();
    }
    else{
        res.status(500).send({message : "Request rejected. Possible reasons can be tradeId is not an integer"})
    }
}

module.exports = {
    checkDeleteRequest
};