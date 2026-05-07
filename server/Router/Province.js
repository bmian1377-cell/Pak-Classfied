const express = require('express');
const router = express.Router();

const { 
    CreateProvince, 
    AllProvince
} = require('../Controller/Province'); 

router.get('/', AllProvince); 
router.post('/', CreateProvince); 

module.exports = router;