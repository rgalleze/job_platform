var express = require('express');
const offresController = require('../controllers/offresController')
var router = express.Router();

router.get('/', offresController.getOffres);
router.get('/offre/id=:id', offresController.voirOffre);
router.get('/offre/ajouter', offresController.showAddOffre);
router.post('/offre/ajouter', offresController.addOffre);
  


module.exports = router;