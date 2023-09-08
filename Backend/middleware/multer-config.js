const multer = require('multer');

const storage = multer.memoryStorage();

const filter = (req, file, callback) => {
  if (file.mimetype.split('/')[0] === 'image') {
        callback(null, true);
  } else {
        callback(new Error('Seulement les images sont autorisées')); 
  }
};


module.exports = multer({storage: storage,fileFilter: filter  }).single('image');