const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { CreateAdvertisment, GetMyAds, GetAllAdsOrLatest, GetAdvertismentByID, UpdateAdvertisment, DeleteAdvertisment , GetAdvertismentByCategory, SearchAds} = require('../Controller/Advertisment');
const { authenticate } = require('../Middleware/authMiddleware');

// // Storage config
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => { cb(null, 'uploads/'); },
//     filename: (req, file, cb) => { cb(null, Date.now() + path.extname(file.originalname)); }
// });

const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'uploads/'); },
    filename: (req, file, cb) => { 
        // Date ke saath Random Number lagana lazmi hai
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); 
    }
});


const fileFilter = (req, file, cb) => {
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const fileExt = path.extname(file.originalname).toLowerCase();
    
    // Check 
    // which extension is not allowwd 
    if (allowedExtensions.includes(fileExt)) {
        cb(null, true);
    } else {
        cb(new Error(`Error: Unsupported file type ${fileExt}! Only JPG, PNG, and WEBP are allowed.`), false);
    }
};
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } 
});


//Search Routes 
router.get('/search', SearchAds); 

//Specific Category/User Routes
router.get('/category/:categoryId', GetAdvertismentByCategory);
router.get('/my/all', authenticate, GetMyAds);
router.get('/', GetAllAdsOrLatest);

//Dynamic ID Routes 
router.get('/:id', GetAdvertismentByID); 
router.post('/', authenticate, upload.array('Images', 10), CreateAdvertisment);
router.put('/:id', authenticate, upload.array('Images', 10), UpdateAdvertisment);
router.delete('/:id', authenticate, DeleteAdvertisment);

module.exports = router;