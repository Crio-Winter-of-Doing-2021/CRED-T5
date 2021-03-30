const pool = require('../db');
const checkValidity = async (card_id, time) => {
    const reminder_time_pattern = new RegExp("[0-9]{2}-[0-9]{2}-[0-9]{2}");
    let reminder_time_match = reminder_time_pattern.exec(time);
    const date = parseInt(time.split('-')[0]);
    const hours = parseInt(time.split('-')[1]);
    const minutes = parseInt(time.split('-')[2]);
    if (reminder_time_match === null || date > 31 || date <= 0 || hours >= 24 || hours < 0 || minutes <= 0 || minutes > 59) {
        return { status: "INVALID" };
    }
    const cardData = await pool.query(`SELECT * FROM cards WHERE card_id = '${card_id}'`);
    if (cardData.rows.length === 0) {
        return { status: "INVALID CARD ID" };
    }
    return { status: "VALID" };
}

module.exports = async (req, res, next) => {
    const response = await checkValidity(req.card_id, req.body.time);
    // console.log(response);
    if (response.status === "INVALID")
        return res.status(400).send({ message: "Invalid input date or time" });
    else if (response.status === "INVALID CARD ID")
        return res.status(400).send({ message: "Invalid card id" });
    next();
}