const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
    try {
        const { user_id } = req.userDataFromJWT;
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
        let due = statement.rows[0].due_date.split("/");
        let due_date = parseInt(due[0]);
        let due_month = parseInt(due[1]);
        let due_year = parseInt(due[2]);
        const curr_date = new Date();
        let date = curr_date.getDate();
        let month = curr_date.getMonth() + 1;
        let year = curr_date.getFullYear();
        let coins_earned;
        if (year > due_year || (year === due_year && month > due_month) || (year === due_year && month === due_month && date > due_date)) {
            coins_earned = 0;
        } else {
            coins_earned = amount;
        }
        date = date.toString();
        if (date.length === 1) {
            date = "0" + date;
        }
        month = month.toString();
        if (month.length === 1) {
            month = "0" + month;
        }
        year = year.toString();
        let pay_date = date + "/" + month + "/" + year;
        const payment = await pool.query(`INSERT INTO payments(amount, date, coins_earned, payment_statement_id) VALUES('${amount}', '${pay_date}', '${coins_earned}', '${statement.rows[0].statement_id}') RETURNING *`);
        const new_outstanding = outstanding_amount - amount;
        await pool.query(`UPDATE cards SET outstanding_amount = '${new_outstanding}' WHERE card_id = '${card_id}'`);
        let coin_bal_res = await pool.query(`SELECT coins from users WHERE user_id = '${user_id}'`);
        let coin_bal = coin_bal_res.rows[0].coins;
//         console.log(coin_bal);
        let new_coin_bal = parseInt(coin_bal) + parseInt(coins_earned);
//         console.log(new_coin_bal);
        await pool.query(`UPDATE users SET coins = ${new_coin_bal} WHERE user_id = '${user_id}'`);
        const payment_id = payment.rows[0].payment_id;
        return res.status(201).send({ payment_id });
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({ message: "Internal Server Error" });
    }
})

module.exports = router;
