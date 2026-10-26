const fs = require('fs');
const path = require('path');
const multer = require('multer');

const imageDirectory = path.resolve(__dirname, '..', 'images');
fs.mkdirSync(imageDirectory, { recursive: true });

const storage = multer.diskStorage({
    destination: imageDirectory,
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        callback(null, `${Date.now()}_${name}`);
    }
});

module.exports = multer({ storage }).single('image');
