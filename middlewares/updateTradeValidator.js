const checkUpdateRequest = async function(req,res,next){
    var TradeData = req.body;
    if(TradeData.tradeId){
        next();
    }
    else{
        res.send({message: "Invalid request TradeId Absent!"});
    }
}

module.exports = {
    checkUpdateRequest
};