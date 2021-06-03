const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
    tickerSymbol:{
        type: String,
        ref: 'security'
    },
    averageCost: Number,
    Quantity : Number
});

var PortfolioModel = mongoose.model('Portfolio', portfolioSchema);

module.exports = PortfolioModel;