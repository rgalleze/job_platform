var express = require('express');
const offresController = require('../controllers/offresController')
const usersController = require('../controllers/usersController')

var router = express.Router();
var multer = require('multer');  

var my_storage = multer.diskStorage({
    destination: function (req, file, cb) { cb(null, 'mesfichiers')},
    filename: function (req, file, cb) {
      let my_extension = file.originalname.slice(file.originalname.lastIndexOf(".")); // on extrait l'extension du nom d'origine du fichier
      cb(null, req.body.myUsername + '-' + req.body.myFileType+my_extension); // exemple de format de nommage : login-typedoc.ext
    }
  })
var upload = multer({ storage: my_storage }) 




router.get('/', offresController.getOffres);
router.get('/mesCandidatures', usersController.getCandidatures);
router.get('/mesCandidatures/delete', usersController.deleteCandidature);
router.get('/offre/:id', offresController.voirOffre);
router.get('/offre/:id/postuler', offresController.showCandidaterOffre);
router.post('/offre/:id/postuler/upload',upload.single('myFileInput'), offresController.upload);
router.get('/offre/:id/postuler/getfile', offresController.getfile);
router.get('/offre/:id/postuler/delete', offresController.deletefile);
router.post('/offre/:id/postuler', offresController.candidaterOffre);



  


module.exports = router;