var express = require('express');
const offresController = require('../controllers/offresController')
const usersController = require('../controllers/usersController')

var router = express.Router();

router.get('/', offresController.getOffres);
router.get('/demandes', usersController.showDemandesRec);
router.get('/demandes/approve', usersController.acceptDemandeRec);
router.get('/demandes/refuse', usersController.refuseDemandeRec);

router.get('/offre/ajouter', offresController.showAddOffre);
router.post('/offre/ajouter', offresController.addOffre);


router.get('/offre/:id', offresController.voirOffre);
router.get('/offre/:id/edit', offresController.showEditOffre);
router.post('/offre/:id/edit', offresController.editOffre);
router.get('/offre/:id/delete', offresController.deleteOffre);


router.get('/offre/:id/candidatures', offresController.getCandidaturesOffre);
router.get('/offre/:id/candidatures/accept', offresController.acceptCandidature);
router.get('/offre/:id/candidatures/getfile', offresController.getfile);


//router.post('/offre/:id/delete', offresController.deleteOffre);



  


module.exports = router;