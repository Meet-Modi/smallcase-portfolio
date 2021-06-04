const express = require('express')
const router = express.Router()

//Importng all controllers
const securitycontroller = require('../controllers/securityController')
const portfoliocontroller = require('../controllers/portfolioController')
const tradecontroller = require('../controllers/tradeController')

//Importing all Models
const TradeModel = require('../models/trade')
const PortfolioModel = require('../models/portfolio')

//Initializing all Middleware Validators
const addTradeValidator = require('../middlewares/addTradeValidator')
const deleteTradeValidator = require('../middlewares/deleteTradeValidator')
const updateTradeValidator = require('../middlewares/updateTradeValidator')

//All router codes which decides the flow of the API
router.get('/fetch',tradecontroller.fetchAllTrades);
router.post('/add',addTradeValidator.addTradeValidator,tradecontroller.InsertTrades);
router.post('/delete',deleteTradeValidator.checkDeleteRequest,tradecontroller.DeleteTrade);
router.put('/update',updateTradeValidator.checkUpdateRequest,tradecontroller.UpdateTrade);

module.exports = router;

