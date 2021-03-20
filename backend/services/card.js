const cardRepo = require('../repositories/card');
const ResourceAlreadyExistsError = require('../errors/ResourceAlreadyExistsError');

const constructCardDTO = (card) => {
    return {
        card_id: card.card_id,
        card_no: card.card_no,
        expiry_date: card.expiry_date,
        name_on_card: card.name_on_card,
        outstanding_amount: card.outstanding_amount
    };
};

const getAllCards = async (userId) => {
    let response = [];
    const cards = await cardRepo.findCardsByUserId(userId);
    cards.forEach(card => {
        response.push(constructCardDTO(card));
    });
    return response;
};

const addCard = async (card, userId) => {
    const sameCard = await cardRepo.findCardByCardNumber(card.card_no);
    if (sameCard !== null) {
        throw new ResourceAlreadyExistsError("Same card already in use");
    }
    return await cardRepo.addCard(card, userId);
};

module.exports = {
    getAllCards,
    addCard
};