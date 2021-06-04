const express = require('express');
const router = express.Router();

const securityController = require('../controllers/securityController')

const securitymodel = require('../models/security')

const addSecurityValidator = require('../middlewares/addSecurityValidator')

router.get('/fetch',securityController.fetchAllExistingSecurities);
router.post('/add',addSecurityValidator.addSecurityValidator,securityController.add_security);

module.exports = router;