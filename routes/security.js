const express = require('express');
const router = express.Router();

const securityController = require('../controllers/securityController')

const securitymodel = require('../models/security')

router.get('/fetch',securityController.fetchAllExistingSecurities);
router.post('/add',securityController.add_security);

module.exports = router;