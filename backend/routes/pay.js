const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
    try {
        const card_id = req.card_id;
        const { amount } = req.body;
        const statement = await pool.query(`SELECT * FROM statements WHERE statement_card_id = '${card_id}' ORDER BY year DESC, month DESC LIMIT 1`);
        if (statement.rows.length === 0) {
            return res.status(404).send({ message: "No statements found to pay for" });
        }
        const outstanding = await pool.query(`SELECT outstanding_amount FROM cards WHERE card_id = '${card_id}'`);
        const outstanding_amount = outstanding.rows[0].outstanding_amount;
        if (amount < 1 || amount > outstanding_amount) {
            return res.status(400).send({ message: "Invalid pay amount" });
        }
        const payment = await pool.query(`INSERT INTO payments(amount, payment_statement_id) VALUES('${amount}', '${statement.rows[0].statement_id}') RETURNING *`);
        const new_outstanding = outstanding_amount - amount;
        await pool.query(`UPDATE cards SET outstanding_amount = '${new_outstanding}' WHERE card_id = '${card_id}'`);
        const payment_id = payment.rows[0].payment_id;
        return res.status(201).send({payment_id});
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({ message: "Internal Server Error" });
    }
})

module.exports = router;