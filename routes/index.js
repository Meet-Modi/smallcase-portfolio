const express = require('express')
const path = require('path')

const router = express.Router()

router.get('/', function (req, res) {
    res.send(`Hello World! index router here`);
})

module.exports = router;