var express = require('express');
const offresController = require('../controllers/offresController')
var router = express.Router();

router.get('/', offresController.getOffres);

module.exports = router;