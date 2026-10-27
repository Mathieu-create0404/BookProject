const Books = require('../models/Books.js');
const fs = require('fs');

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Books({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        ratings: [],
        averageRating: 0,
    });
    book.save()
        .then(() => { res.status(201).json({ message: 'Livre enregistré !' }) })
        .catch(error => { res.status(400).json({ error }) })
};

exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    delete bookObject._userId;

    Books.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) {
                return res.status(403).json({ error: 'Requête non autorisée !' });
            }
            Books.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Livre modifié !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(404).json({ error }));
};

exports.deleteBook = (req, res, next) => {
    Books.findOne({ _id: req.params.id })
        .then(book => {
            if (book.userId != req.auth.userId) {
                return res.status(403).json({ error: 'Requête non autorisée !' });
            }
            Books.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Livre supprimé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(404).json({ error }));
};

exports.getOneBook = (req, res, next) => {
    Books.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(404).json({ error }));
}

exports.getAllBooks = (req, res, next) => {
    Books.find()
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
}

exports.getBestBooks = (req, res, next) => {
    Books.find().sort({ averageRating: -1 }).limit(3)
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
}

exports.rateBook = (req, res, next) => {
    Books.findOne({ _id: req.params.id })
        .then(book => {
            if (!book) {
            return res.status(404).json({ error: 'Livre non trouvé !' });
            }

            if (req.body.rating === undefined || req.body.rating === "") {
                return res.status(400).json({ error: 'La note est obligatoire !' });
            }

            const rating = Number(req.body.rating);
            if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
                return res.status(400).json({
                    error: 'La note doit être un nombre compris entre 0 et 5 !'
                });
            }

            const alreadyRated = book.ratings.some(
                rating => rating.userId === String(req.auth.userId)
            );
            if (alreadyRated) {
               return res.status(400).json({ message: 'Livre déjà noté !' });
            } else {
                book.ratings.push({ userId: req.auth.userId, grade: rating });

                const total = book.ratings.reduce((accumulator, rating) => {
                return accumulator + rating.grade;
                }, 0);
                book.averageRating = total / book.ratings.length;
                
                book.save()
                    .then(() => res.status(200).json(book))
                    .catch(error => res.status(500).json({ error }));
            }
        })
        .catch(error => res.status(404).json({ error }));
}; 