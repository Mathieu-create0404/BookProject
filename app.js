const express = require('express');
const cors = require('cors');
const booksRoutes = require('./routes/books.js');
const userRoutes = require('./routes/users.js');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/books', booksRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static('images'));


module.exports = app;