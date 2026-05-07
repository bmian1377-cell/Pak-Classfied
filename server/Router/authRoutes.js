const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { registerUser, loginUser, updateProfile , ForgotPassword, VerifyOTP , Resetpassword } = require('../Controller/authController'); 
const { authenticate } = require('../Middleware/authMiddleware'); 


const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'uploads/'); },
    filename: (req, file, cb) => {
        cb(null, "user-" + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Routes
router.post('/register', upload.single('Image'), registerUser); // 🛑 Added Multer
router.post('/login', loginUser);
router.put('/update-me', authenticate, upload.single('Image'), updateProfile); 
router.post('/forgot-password', ForgotPassword)
router.post('/verify-otp', VerifyOTP);
router.post('/reset-password', Resetpassword)


module.exports = router;