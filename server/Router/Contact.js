const express = require('express');
const router = express.Router();
const { sendContactEmail } = require('../Controller/Contact');

router.post('/submit', sendContactEmail);

module.exports = router;