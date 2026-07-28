const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');
const auth = require('../middlewares/auth');

router.post('/', auth, cardController.createCard);
router.get('/', auth, cardController.getUserCards);
router.get('/:id', auth, cardController.getCardById);
router.put('/:id', auth, cardController.updateCard);
router.delete('/:id', auth, cardController.deleteCard);

module.exports = router;
