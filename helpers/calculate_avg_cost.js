function calculate_avg_cost(Oldportfolio,NewTrade){
    var old = {};
    quantity1 = Oldportfolio.Quantity;
    quantity2 = NewTrade.quantity;

    price1 = Oldportfolio.averageCost;
    price2 = NewTrade.unitPrice;

    new_avgprice = ((price1*quantity1) + (price2*quantity2))/(quantity1+quantity2);
    console.log(new_avgprice)
    return new_avgprice;
}

module.exports = {
    calculate_avg_cost};