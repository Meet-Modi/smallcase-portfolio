const express = require('express');
const path = require('path');

const securityController = require('../controllers/securityController')
const portfolioController = require('../controllers/portfolioController')

const securitymodel = require('../models/security')
const portfoliomodel = require('../models/portfolio')

const router = express.Router();

router.get('/fetch',portfolioController.fetchcurrentPortfolio);
router.get('/fetchReturns', portfolioController.fetchPnL);


module.exports = router;