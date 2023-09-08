const sharp = require('sharp');
const resizeImage = async (req, res, next) => {
      if (!req.file) {
            return next(); //verifie si un fichier a etait téléchargé
      }
      try {
            const imagePath = req.file.buffer // Obtenir le tampon du fichier téléchargé.
            const name = req.file.originalname.split('.')[0]; // Obtenir le nom de fichier d'origine sans l'extension.
            const sharpFile = await sharp(imagePath).resize({ width: 206, height: 260, fit: sharp.fit.fill }).webp({ quality: 100 }).toFile(`images/${name}.webp`);
      } catch (error) {
            return res.status(500).json({ message: "Erreur de redimensionnement de l'image" });
      }

      next();
};

module.exports = { resizeImage }