const express = require('express');
const router = express.Router();

const { 
    CreateCityArea, 
    AllCityArea
} = require('../Controller/CityArea'); 

router.get('/', AllCityArea); 
router.post('/', CreateCityArea); 

module.exports = router;