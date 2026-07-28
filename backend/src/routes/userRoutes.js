const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');

router.get('/', auth, userController.getAllUsers);
router.get('/profile', auth, userController.getProfile);
router.get('/:id', auth, userController.getUserById);
router.put('/profile', auth, userController.updateProfile);
router.put('/profile/photo', auth, userController.updateProfilePhoto);
router.put('/change-password', auth, userController.changePassword);
router.put('/:id', auth, userController.updateUser);
router.delete('/:id', auth, userController.deleteUser);

module.exports = router;
