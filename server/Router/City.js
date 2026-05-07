const express = require('express');
const router = express.Router();

const { 
    CreateCity, 
    AllCity
} = require('../Controller/City'); 

router.get('/', AllCity); 
router.post('/', CreateCity); 

module.exports = router;