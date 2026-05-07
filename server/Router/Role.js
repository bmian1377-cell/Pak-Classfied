const express = require('express');
const router = express.Router();

const { 
    CreateRole, 
    AllRole
} = require('../Controller/Role'); 

router.get('/', AllRole); 
router.post('/', CreateRole); 

module.exports = router;