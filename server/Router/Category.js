const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { CreateCategory, AllCategory } = require('../Controller/Category');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },

    filename: (req, file, cb) => {
        // Filename ko unique banana: "cat-timestamp.jpg"
        cb(null, `cat-${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage: storage });


router.get('/', AllCategory);
router.post('/', upload.single('Image'), CreateCategory); 

module.exports = router;