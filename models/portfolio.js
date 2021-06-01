const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
    portfolioId : {
        type: String,
        unique : true
    },
    portfolio:[
        {
            securityId:{
                type: String,
                ref: 'SecurityModel'
            },
            averageCost: Number,
            Quantity : Number
        }
    ]
});

var PortfolioModel = mongoose.model('Portfolio', portfolioSchema);

module.exports = PortfolioModel;