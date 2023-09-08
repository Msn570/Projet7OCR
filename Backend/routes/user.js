const express = require ('express');
const router = express.Router();
const userController = require('../controllers/user');

router.post('/signup', userController.signup); // Inscription

router.post('/login', userController.login); // Connexion

module.exports = router;