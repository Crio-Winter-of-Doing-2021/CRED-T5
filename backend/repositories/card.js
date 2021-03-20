const db = require('../db');

const findCardByCardNumber = async (cardNumber) => {
    let card = null;
    const result = await db.query(`SELECT * FROM cards WHERE card_no = '${cardNumber}'`);
    if (result.rows.length === 1) {
        card = result.rows[0];
    }
    return card;
}

const findCardsByUserId = async (userId) => {
    const result = await db.query(`SELECT * FROM cards WHERE card_user_id = '${userId}'`);
    return result.rows;
}

const addCard = async (card, userId) => {
    const result = await db.query(`INSERT INTO cards(card_no, expiry_date, name_on_card, card_user_id) VALUES('${card.card_no}', '${card.expiry_date}', '${card.name_on_card}', '${userId}') RETURNING *`);
    return result.rows[0].card_id;
}

module.exports = {
    findCardByCardNumber,
    findCardsByUserId,
    addCard
};
