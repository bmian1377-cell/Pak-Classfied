const jwt = require('jsonwebtoken'); 
const User = require('../Models/User'); 

async function authenticate(req, res, next) {
    let token;

    // 1. Check karo ke Header mein "Authorization" hai aur wo "Bearer" se shuru ho raha hai
    // Example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 2. "Bearer " ko hata kar sirf asli Token nikaalo
            // split(' ') [1] ka matlab hai space ke baad wala dusra hissa (token)
            token = req.headers.authorization.split(' ')[1];

            // 3. Token ko "Verify" karo apne Secret Key ke saath
            // Agar token nakli ya expired hoga toh yeh line "Catch" mein bhej degi
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 4. Token ke andar se User ID nikaalo aur Database mein dhoondo
            // .select('-Password') ka matlab hai ke password mat nikaalna (Security)
            req.user = await User.findById(decoded.id).select('-Password');

            // 5. Agar Token sahi hai par database mein woh user hi nahi hai
            if (!req.user) {
                return res.status(401).json({ error: 'Not authorized, user not found' });
            } 

            // 6. Sab sahi hai! Agle function (Controller) par chale jao
            next();

        } catch (error) {
            // Agar token galat hai, expired hai ya kisi ne tampering ki hai
            console.error('Token Verification Failed:', error);
            return res.status(401).json({ error: 'Not authorized, invalid or expired token' });
        }
    }

    // 7. Agar Header mein token bheja hi nahi gaya
    if (!token) {
        return res.status(401).json({ error: 'Not authorized, no token provided' });
    }
}

module.exports = { authenticate };