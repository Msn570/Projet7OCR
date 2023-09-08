const Book = require("../models/Books");
const fs = require('fs');

exports.getAllBooks = (req, res, next) => {
  Book.find()                 // trouve tout les livres 
    .then(book => res.status(200).json(book))
    .catch(error => res.status(500).json({ error }));
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })        // trouve un livre en particulier
    .then(book => res.status(200).json(book))
    .catch(error => res.status(500).json({ error }));
};

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id
  delete bookObject._userId
  const filename = req.file.originalname; // recupere nom d'origine
  const parts = filename.split("."); //coupe le nom d'origine a son extension 
  const nameWithoutExtension = parts.slice(0, -1).join("."); // retire l'extension 
  const newFilename = `${nameWithoutExtension}.webp`; // modifie le nom du fichier pour rajouter l'extension webp

  const book = new Book({ // création d'un nouvel objet Book
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${newFilename}` //création de l'URL de l'image
  });

  book.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !' })) // enregistrement du livre dans la base de données
    .catch(error => res.status(500).json({ error }));
};

exports.modifyBook = (req, res, next) => { // modification livre
  const bookObject = req.file ? {
    ...JSON.parse(req.body.book),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete bookObject._userId;  
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: 'Not authorized' });
      } else {
        Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id }) // modification dans la bdd
          .then(() => res.status(200).json({ message: 'Objet modifié!' }))
          .catch(error => res.status(500).json({ error }));
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.deleteBook = (req, res, next) => {  // supression d'un livre
  Book.findOne({ _id: req.params.id})
      .then(book => {
          if (book.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'});
          } else {
              const filename = book.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                Book.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                      .catch(error => res.status(500).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};

exports.bookRating = async (req, res, next) => {
  const bookId = req.params.id;
  const { userId, rating } = req.body;

  try {
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ error: 'Livre non trouvé !' });
    }

    const ratingIndex = book.ratings.findIndex(rating => rating.userId == req.auth.userId);

    if (ratingIndex !== -1) {
          return res.status(409).json({ error: 'Déjà noté' });
    } else {
      book.ratings.push({ userId, grade: rating });
    }

    const totalRatings = book.ratings.length
    const sumRatings = book.ratings.reduce((sum, rating) => sum + rating.grade, 0)
    book.averageRating = Math.round(sumRatings / totalRatings)
    
    await book.save();
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBestBooks = async (req, res, next) => {
  try {
    const BestRatingsBooks = await Book.find({}).sort({ averageRating: -1 }).limit(3);
    return res.status(200).json(BestRatingsBooks);
} catch (error) {
      res.status(500).json({ error: error });
}
};