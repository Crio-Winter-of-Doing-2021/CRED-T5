const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');
const validateTime = require('../middleware/validateTime');

router.post('/', auth, validateTime, async (req, res) => {
    try {
        const card_id = req.card_id;
        const { reminder_time } = req.body;
        const reminder = await pool.query(`INSERT INTO reminders(reminder_time, reminder_card_id) VALUES('${reminder_time}','${card_id}') RETURNING *`);
        return res.status(201).send({ reminder_id: reminder.rows[0].reminder_id });
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({ message: "Internal Server Error" });
    }
});

router.get('/check', auth, async (req, res) => { // checks if a reminder for the card already exists
    try {
        const card_id = req.card_id;
        const check = await pool.query(`SELECT * FROM reminders WHERE reminder_card_id = '${card_id}'`);
        if (check.rows.length === 0) {
            return res.status(200).send(false);
        }
        else return res.status(200).send(true); // "true" here denotes- "it is true that reminder for the card already exists"
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({ message: "Internal Server Error" });
    }
});

router.delete('/', auth, async (req, res) => {
    try {
        const card_id = req.card_id;
        const del = await pool.query(`DELETE FROM reminders WHERE reminder_card_id = '${card_id}'`);
        if (del.rowCount === 0) {
            return res.status(400).send({ message: "No reminder set for the given card_id to delete" });
        }
        return res.status(200).send({ message: "Delete Successful" });
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({ message: "Internal Server Error" });
    }
})

module.exports = router;