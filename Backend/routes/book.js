const express = require ('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const {resizeImage} = require('../middleware/sharp');


const bookController = require('../controllers/book');



router.post('/', auth, multer, resizeImage, bookController.createBook) // création d'un livre !

router.put('/:id', auth, multer, bookController.modifyBook) // modification d'un livre !

router.delete('/:id', auth, bookController.deleteBook) // suppression d'un livre !

router.post('/:id/rating', auth, bookController.bookRating) // ajout d'une note à un livre  

router.get('/bestrating', bookController.getBestBooks) // récupération top 3 livres

router.get('/:id', bookController.getOneBook) // récupération d'un livre !

router.get('', bookController.getAllBooks) // récupération de tous les livres !



module.exports = router;