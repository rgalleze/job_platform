var express = require('express');
const candidatsController = require('../controllers/candidatsController')
var router = express.Router();

router.get('/', candidatsController.getOffres);
router.get('/offre/:id', candidatsController.voirOffre);
  


module.exports = router;