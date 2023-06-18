var express = require('express');
const offresController = require('../controllers/offresController')
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
router.get('/offre/:id', offresController.voirOffre);
router.get('/offre/:id/postuler', offresController.showCandidaterOffre);
router.post('/offre/:id/postuler',upload.single('myFileInput'), offresController.upload);
router.get('/offre/:id/postuler/getfile', offresController.getfile);
router.get('/offre/:id/postuler/delete', offresController.deletefile);



  


module.exports = router;