const express = require('express');
const path = require('path');
const securityController = require('../controllers/securityController')
const securitymodel = require('../models/security')

const router = express.Router();

router.get('/fetch',securityController.fetchAllExistingSecurities);
router.post('/add',securityController.add_security);

module.exports = router;