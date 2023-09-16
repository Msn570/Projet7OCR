const jwt = require('jsonwebtoken');
require('dotenv').config();
 
module.exports = (req, res, next) => {
    const tokenSecret = process.env.TRO; // Utilisation de la clé secrète de l'environnement
   try {
       const token = req.headers.authorization.split(' ')[1];
       const decodedToken = jwt.verify(token, tokenSecret);
       const userId = decodedToken.userId;
       req.auth = {
           userId: userId
       };
	next();
   } catch(error) {
       res.status(500).json({ error });
   }
};