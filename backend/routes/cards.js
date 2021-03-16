const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');
const validateCard = require('../middleware/validateCard');

router.get('/', auth, async (req, res) => {
    try {
        const { user_id } = req.userDataFromJWT;
        const user_cards = await pool.query(`SELECT * FROM cards WHERE card_user_id = '${user_id}'`);
        res.status(200).send(user_cards.rows);
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

router.post('/', auth, validateCard, async (req, res) => {
    try {
        const { card_no, expiry_date, name_on_card } = req.body;
        const { user_id } = req.userDataFromJWT;
        // console.log("Request: POST /cards, user_id: " + user_id + ", card_no: " + card_no + ", expiry_date: " + expiry_date + ", name_on_card: " + name_on_card);
        // Check if same card is already present
        const same_cards = await pool.query(`SELECT * FROM cards WHERE card_no = '${card_no}'`);
        if (same_cards.rows.length > 0) {
            return res.status(409).send({ message: "Same card already in use" });
        }
        // Add card
        const card = await pool.query(`INSERT INTO cards(card_no, expiry_date, name_on_card, card_user_id) VALUES('${card_no}', '${expiry_date}', '${name_on_card}', '${user_id}') RETURNING *`);
        res.status(201).send({ card_id: card.rows[0].card_id });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;
