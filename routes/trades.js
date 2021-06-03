const express = require('express')
const router = express.Router()

const securitycontroller = require('../controllers/securityController')
const portfoliocontroller = require('../controllers/portfolioController')
const tradecontroller = require('../controllers/tradeController')

const TradeModel = require('../models/trade')
const PortfolioModel = require('../models/portfolio')

const deleteTradeValidator = require('../middlewares/deleteTradeValidator')
const updateTradeValidator = require('../middlewares/updateTradeValidator')


router.get('/fetch',tradecontroller.fetchAllTrades);
router.post('/add',tradecontroller.InsertTrades);
router.post('/delete',deleteTradeValidator.checkDeleteRequest,tradecontroller.DeleteTrade);
router.put('/update',updateTradeValidator.checkUpdateRequest,tradecontroller.UpdateTrade);

module.exports = router;

