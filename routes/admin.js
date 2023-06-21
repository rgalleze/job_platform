var express = require('express');
const offresController = require('../controllers/offresController')
const usersController = require('../controllers/usersController')

var router = express.Router();

router.get('/', offresController.getOffres);
router.get('/org/ajouter', usersController.showAddOrg);
router.post('/org/ajouter', usersController.AddOrgAdmin);


router.get('/offre/:id', offresController.voirOffre);


module.exports = router;