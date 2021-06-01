const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
    txnId: {
        type: String,
        unique: true
    },
    timestamp: {
        type: Date,
        default: Date.now()
    },
    securityId: {
        type: String,
        ref: 'Securities'
    },
    txnType: {
        type: String,
        enum: ['Buy','Sell']
    },
    quantity: {
        type: Number,
        min: 1
    },
    unitPrice: Number,
    txnAmount: Number,
    Status:{
        type: String,
        enum: ['Executed','Partial','Open','Cancelled'],
        default: 'Open'
    }
});

var TradeModel = mongoose.model('Trade', tradeSchema);

module.exports = TradeModel;