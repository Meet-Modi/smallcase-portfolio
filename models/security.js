const mongoose = require('mongoose');

const securitySchema = new mongoose.Schema({
    tickerSymbol: {
        type: String,
        unique: true
    },
    securityName: String
});

var SecurityModel = mongoose.model('Security', securitySchema);

module.exports = SecurityModel;