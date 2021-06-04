const express = require('express')
const path = require('path')

const router = express.Router()

//Index router for /api, no use just for testing purposes.
router.get('/', function (req, res) {
    res.send(`Hello World! index router here`);

})

module.exports = router;