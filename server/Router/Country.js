const express = require('express');
const router = express.Router();

const { 
    CreateCountry, 
    AllCountry
} = require('../Controller/Country');

router.get('/', AllCountry); 
router.post('/', CreateCountry); 

module.exports = router;