const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const path = require('path');

const app = express()

app.use(cors({
  origin: "*",
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: "Origin, X-Requested-With, x-acces-token, role, Content, Accept, Content-type, Authorization",
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// importation des routes d'authentification et de gestion des livres
const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');


app.get('/', (req, res) => res.send('Sa marche !'))


app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/books', bookRoutes)
app.use('/api/auth', userRoutes)

app.get('*', (req, res) => res.status(501).send('Sa marche pas !!!!'))

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    app.listen(process.env.SERVER_PORT, () => {
      console.log(`Running on Port ${process.env.SERVER_PORT}.`)
    })
  })
  .catch(error => console.log("Database Error", error))
