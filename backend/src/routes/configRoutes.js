const express = require('express');
const router = express.Router();
const configController = require('../controllers/configController');

router.get('/logo', configController.getLogo);
router.put('/logo', configController.updateLogo);

module.exports = router;
