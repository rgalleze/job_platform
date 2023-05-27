var express = require('express');
const offresController = require('../controllers/offresController')
var router = express.Router();

router.get('/', offresController.getOffres);
router.get('/offre/:id', offresController.voirOffre);
router.get('/offre/:id/candidater', offresController.candidaterOffre);
  


module.exports = router;