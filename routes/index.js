const express = require('express')
const router = express.Router()

const home = require('./modules/home')
const currency = require('./modules/currency')
router.use('/', home)

router.use('/currency', currency)

module.exports = router
