const e = require("express");

function GetNewAvgCost(Oldportfolio,NewTrade){
    var quantity1 = Oldportfolio.Quantity;
    var quantity2 = NewTrade.quantity;

    var price1 = Oldportfolio.averageCost;
    var price2 = NewTrade.unitPrice;

    var new_avgprice = ((price1*quantity1) + (price2*quantity2))/(quantity1+quantity2);
    console.log(new_avgprice)
    return new_avgprice;
}

function RevertAvgCost(Oldportfolio,trade){
    var new_avgprice = 0;
    
    var quantity1 = Oldportfolio.Quantity;
    var quantity2 = trade.quantity;
    var price1 = Oldportfolio.averageCost;
    var price2 = trade.unitPrice;

    if(quantity1 == quantity2){
        new_avgprice = 0;
        return new_avgprice;
    }
    else if(quantity1 > quantity2){
        new_avgprice = ((price1*quantity1) - (price2*quantity2))/(quantity1-quantity2);
        return new_avgprice;
    }

}

module.exports = {
    GetNewAvgCost,
    RevertAvgCost
};