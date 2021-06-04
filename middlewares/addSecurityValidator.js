// Function for checking lowercase of tickersymbol passed in the parameters. If not true, 
// will reject the user request.
function addSecurityValidator(req,res,next){
    var data = req.body;
    if(isUpperCase(data.tickerSymbol)){
        next();
    }
    else
        res.status(500).send({message : "Request rejected. Possible reason can be lowercase tickersymbol"})
}

function isUpperCase(str) {
    return str === str.toUpperCase();
}

module.exports = {
    addSecurityValidator
}