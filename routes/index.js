var express = require('express');
const authController = require('../controllers/authController')
var router = express.Router();



router.get('/', authController.firstLoad)
router.get('/login', authController.showLogin)
router.get('/register', authController.showRegister)
router.get('/logout', authController.logout)
router.post('/login', authController.login)
router.post('/register', authController.register)



module.exports = router;
