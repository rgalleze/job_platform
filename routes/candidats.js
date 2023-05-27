var express = require('express');
const offresController = require('../controllers/offresController')
var router = express.Router();

// on va utliser Multer comme middleware de gestion d'upload de fichier (faire au préalable : npm install multer)
var multer = require('multer');  

// définition du répertoire de stockage des fichiers chargés (dans le répertoire du projet pour la démo, mais sur un espace dédié en prod !)
// et du nom sous lequel entregistrer le fichier
var my_storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, 'mesfichiers')},
  filename: function (req, file, cb) {
    let my_extension = file.originalname.slice(file.originalname.lastIndexOf(".")); // on extrait l'extension du nom d'origine du fichier
    cb(null, req.body.myUsername + '-' + req.body.myFileType+my_extension); // exemple de format de nommage : login-typedoc.ext
  }
})

var upload = multer({ storage: my_storage }) 

router.get('/', offresController.getOffres);
router.get('/offre/:id', offresController.voirOffre);
router.get('/offre/:id/postuler', offresController.showCandidaterOffre);
router.post('/offre/:id/postuler',upload.single('myFileInput'), offresController.candidaterOffre);
  


module.exports = router;