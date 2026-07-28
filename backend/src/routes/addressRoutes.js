const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const auth = require('../middlewares/auth');

router.post('/', auth, addressController.createAddress);
router.get('/', auth, addressController.getUserAddresses);
router.get('/:id', auth, addressController.getAddressById);
router.put('/:id', auth, addressController.updateAddress);
router.delete('/:id', auth, addressController.deleteAddress);

module.exports = router;
