const express = require('express');
const path = require('path');
const securityController = require('../controllers/securityController')
const securitymodel = require('../models/security')

const router = express.Router();

router.get('/fetch',securityController.check_if_security_exists);

router.post('/addSecurity',securityController.add_security);

module.exports = router;