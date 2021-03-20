const router = require('express').Router();
const auth = require('../middleware/auth');
const validateCard = require('../middleware/validateCard').validateCard;
const cardService = require('../services/card');

router.get('/', auth, async (req, res) => {
    try {
        const { user_id } = req.userDataFromJWT;
        const cards = await cardService.getAllCards(user_id);
        res.status(200).send(cards);
    } catch (err) {
        console.log(err.stack);
        res.status(err.status || 500).send({ message: err.message });
    }
});

router.post('/', auth, validateCard, async (req, res) => {
    try {
        const { user_id } = req.userDataFromJWT;
        const card_id = await cardService.addCard(req.body, user_id);
        res.status(201).send({ card_id });
    } catch (err) {
        console.log(err.stack);
        res.status(err.status || 500).send({ message: err.message });
    }
});

module.exports = router;
