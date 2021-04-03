const router = require('express').Router();
const { response } = require('express');
const pool = require('../db');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
    try {
        const card_id = req.card_id;
        // console.log(card_id);
        const card = await pool.query(`SELECT * FROM cards WHERE card_id = '${card_id}'`);
        if (card.rows.length === 0) {
            return res.status(404).send({ message: `No card with card_id '${card_id}' found` });
        }
        const statement = await pool.query(`SELECT statement_id FROM statements WHERE statement_card_id = '${card_id}' ORDER BY year DESC, month DESC LIMIT 1`);
        if (statement.rows.length === 0) {
            return res.status(404).send({ message: "No statements found" });
        }
        const statement_id = statement.rows[0].statement_id;
        const transactions = await pool.query(`SELECT * FROM transactions WHERE transaction_statement_id = '${statement_id}' AND type = 'D'`);
        // res.status(200).send(transactions.rows);
        const merchants = transactions.rows;
        const merchants_smart_obj = {};
        merchants.forEach(m => {
            if (merchants_smart_obj[m.merchant] !== undefined) {
                merchants_smart_obj[m.merchant].push({ amount: m.amount, category: m.category });
            }
            else {
                merchants_smart_obj[m.merchant] = [];
                merchants_smart_obj[m.merchant].push({ amount: m.amount, category: m.category });
            }
        });
        const merchants_smart = [];
        let net_sum = 0;
        for (let m in merchants_smart_obj) {
            let sum = 0;
            for (let i = 0; i < merchants_smart_obj[m].length; i++) {
                sum += merchants_smart_obj[m][i].amount;
            }
            net_sum += sum;
            merchants_smart.push({ merchant: m, amount_spent: sum });
        }
        merchants_smart.forEach(m => {
            m['percentage'] = Math.round(m.amount_spent / net_sum * 100);
            // console.log(m);
        })
        merchants_smart.sort((a, b) => (a.percentage < b.percentage) ? 1 : ((a.percentage > b.percentage) ? -1 : ((a.amount_spent < b.amount_spent) ? 1 : -1)));
        const categories = transactions.rows;
        const categories_smart_obj = {};
        categories.forEach(c => {
            if (categories_smart_obj[c.category] !== undefined) {
                categories_smart_obj[c.category].push({ amount: c.amount });
            }
            else {
                categories_smart_obj[c.category] = [];
                categories_smart_obj[c.category].push({ amount: c.amount });
            }
        });
        const categories_smart = [];
        for (let c in categories_smart_obj) {
            let sum = 0;
            for (let i = 0; i < categories_smart_obj[c].length; i++) {
                sum += categories_smart_obj[c][i].amount;
            }
            categories_smart.push({ category: c, amount_spent: sum, count: categories_smart_obj[c].length });
        }
        categories_smart.sort((a, b) => (a.count < b.count) ? 1 : ((a.count > b.count) ? -1 : ((a.amount_spent < b.amount_spent) ? 1 : -1)));
        // console.log({ categories_smart: categories_smart, merchants_smart: merchants_smart })
        res.status(200).send({ categories_smart: categories_smart, merchants_smart: merchants_smart });
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/:year/:month', auth, async (req, res) => {
    const card_id = req.card_id;
    const month = parseInt(req.params.month);
    const year = parseInt(req.params.year);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    if (year > currentYear || (year == currentYear && month >= currentMonth) || (month <= 0) || (month > 12)) {
        return res.status(400).send({ message: "Year or month not valid" });
    }
    // month is valid, now check card
    const card = await pool.query(`SELECT * FROM cards WHERE card_id = '${card_id}'`);
    if (card.rows.length === 0) {
        return res.status(404).send({ message: `No card with card_id '${card_id}' found` });
    }
    // card is valid, now check if statement for the specified month exists
    const statement = await pool.query(`SELECT statement_id FROM statements WHERE statement_card_id = '${card_id}' AND month = ${month} AND year = ${year}`);
    if (statement.rows.length === 0) {
        return res.status(404).send({ message: "No statements found" });
    }
    const statement_id = statement.rows[0].statement_id;
    const transactions = await pool.query(`SELECT transaction_id, amount, type, merchant, category FROM transactions WHERE transaction_statement_id = '${statement_id}' AND type = 'D'`);
    // res.status(200).send(transactions.rows);
    const merchants = transactions.rows;
    const merchants_smart_obj = {};
    merchants.forEach(m => {
        if (merchants_smart_obj[m.merchant] !== undefined) {
            merchants_smart_obj[m.merchant].push({ amount: m.amount, category: m.category });
        }
        else {
            merchants_smart_obj[m.merchant] = [];
            merchants_smart_obj[m.merchant].push({ amount: m.amount, category: m.category });
        }
    });
    const merchants_smart = [];
    let net_sum = 0;
    for (let m in merchants_smart_obj) {
        let sum = 0;
        for (let i = 0; i < merchants_smart_obj[m].length; i++) {
            sum += merchants_smart_obj[m][i].amount;
        }
        net_sum += sum;
        merchants_smart.push({ merchant: m, amount_spent: sum });
    }
    merchants_smart.forEach(m => {
        m['percentage'] = Math.round(m.amount_spent / net_sum * 100);
        // console.log(m);
    })
    merchants_smart.sort((a, b) => (a.percentage < b.percentage) ? 1 : ((a.percentage > b.percentage) ? -1 : ((a.amount_spent < b.amount_spent) ? 1 : -1)));
    const categories = transactions.rows;
    const categories_smart_obj = {};
    categories.forEach(c => {
        if (categories_smart_obj[c.category] !== undefined) {
            categories_smart_obj[c.category].push({ amount: c.amount });
        }
        else {
            categories_smart_obj[c.category] = [];
            categories_smart_obj[c.category].push({ amount: c.amount });
        }
    });
    const categories_smart = [];
    for (let c in categories_smart_obj) {
        let sum = 0;
        for (let i = 0; i < categories_smart_obj[c].length; i++) {
            sum += categories_smart_obj[c][i].amount;
        }
        categories_smart.push({ category: c, amount_spent: sum, count: categories_smart_obj[c].length });
    }
    categories_smart.sort((a, b) => (a.count < b.count) ? 1 : ((a.count > b.count) ? -1 : ((a.amount_spent < b.amount_spent) ? 1 : -1)));
    // console.log({ categories_smart: categories_smart, merchants_smart: merchants_smart })
    res.status(200).send({ categories_smart: categories_smart, merchants_smart: merchants_smart });
})

router.get('*', (req, res) => {
    res.status(404).send({ message: "Not Found" });
})
module.exports = router;