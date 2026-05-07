const express = require('express');
const router = express.Router();

const { 
    CreateStatus, 
    GetStatus
} = require('../Controller/Status'); 

router.get('/', GetStatus); 
router.post('/', CreateStatus); 

module.exports = router;