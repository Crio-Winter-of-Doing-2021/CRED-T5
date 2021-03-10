const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

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

module.exports = router;
