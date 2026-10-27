const express = require('express');
const auth = require('../middleware/auth.js');
const multer = require('../middleware/multer-config.js');
const Books = require('../models/Books.js');

const booksCtrl = require('../controllers/books.js')

const router = express.Router();


router.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

router.post('/', auth, multer, booksCtrl.createBook);
router.post('/:id/rating', auth, booksCtrl.rateBook);
router.delete('/:id', auth, booksCtrl.deleteBook);
router.put('/:id', auth, multer, booksCtrl.modifyBook);
router.get('/bestrating', booksCtrl.getBestBooks);
router.get('/:id', booksCtrl.getOneBook);
router.get('/', booksCtrl.getAllBooks);

module.exports = router;