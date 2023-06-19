var express = require('express');
const offresController = require('../controllers/offresController')
var router = express.Router();

router.get('/', offresController.getOffres);
router.get('/offre/:id', offresController.voirOffre);
router.get('/offre/:id/edit', offresController.showEditOffre);
router.post('/offre/:id/edit', offresController.editOffre);
//router.post('/offre/:id/delete', offresController.deleteOffre);


router.get('/offre/ajouter', offresController.showAddOffre);
router.post('/offre/ajouter', offresController.addOffre);
  


module.exports = router;