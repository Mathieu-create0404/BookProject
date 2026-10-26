const app = require('./app');
const http = require('http');
const mongoose = require('mongoose');

const server = http.createServer(app);

require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connexion à MongoDB réussie !')

    server.listen(4000, () => {
    console.log('Serveur lancé sur le port 4000')
    })
   })

  .catch((error) => {
    console.error('Erreur de connexion :', error)
  });