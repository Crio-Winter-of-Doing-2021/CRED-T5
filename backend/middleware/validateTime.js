const pool = require('../db');
const checkValidity = async (card_id, reminder_time) => {
    const reminder_time_pattern = new RegExp("^([0-9]{2}-[0-9]{2}-[0-9]{2})$");
    let reminder_time_match = reminder_time_pattern.exec(reminder_time);
    const date = parseInt(reminder_time.split('-')[0]);
    const hours = parseInt(reminder_time.split('-')[1]);
    const minutes = parseInt(reminder_time.split('-')[2]);
    if (reminder_time_match === null || date > 31 || date <= 0 || hours >= 24 || hours < 0 || minutes < 0 || minutes > 59) {
        return { status: "INVALID" };
    }
    const cardData = await pool.query(`SELECT * FROM cards WHERE card_id = '${card_id}'`);
    if (cardData.rows.length === 0) {
        return { status: "INVALID CARD ID" };
    }
    const checkAlreadyExists = await pool.query(`SELECT * FROM reminders WHERE reminder_card_id = '${card_id}'`);
    if (checkAlreadyExists.rows.length) {
        return { status: "CONFLICT" };
    }
    return { status: "VALID" };
}

module.exports = async (req, res, next) => {
    try {
        const response = await checkValidity(req.card_id, req.body.reminder_time);
        if (response.status === "INVALID")
            return res.status(400).send({ message: "Invalid input date or time" });
        else if (response.status === "INVALID CARD ID")
            return res.status(400).send({ message: "Invalid card id" });
        else if (response.status === "CONFLICT")
            return res.status(409).send({ message: "Reminder for card already exists" });
        next();
    } catch (err) {
        console.log(err.message);
        return res.status(500).send("Internal Server Error");
    }
}