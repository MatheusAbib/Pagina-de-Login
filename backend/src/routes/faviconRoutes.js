const express = require('express');
const router = express.Router();
const faviconController = require('../controllers/faviconController');

router.get('/favicon', faviconController.getFavicon);

module.exports = router;
