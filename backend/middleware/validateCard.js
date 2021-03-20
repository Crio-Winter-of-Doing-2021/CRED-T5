const InvalidCardDetailsError = require('../errors/InvalidCardDetailsError');
const BadRequestError = require('../errors/BadRequestError');

const checkCardValidity = (card_no, expiry_date) => {
    const card_no_pattern = new RegExp("[0-9]{16}");
    let card_no_match = card_no_pattern.exec(card_no);
    // Luhn validation
    let sum = 0;
    for (let i = 15; i >= 0; --i) {
        let digit = parseInt(card_no.charAt(i));
        sum += (i & 1) ? digit : (digit === 9 ? digit : (2 * digit) % 9);
    }
    console.log("Luhn check sum: " + sum);
    if (card_no_match === null || card_no_match.toString().length !== card_no.length || (sum % 10) !== 0) {
        throw new InvalidCardDetailsError("Invalid card number");
    }

    const expiry_date_pattern = new RegExp("[0-9]{2}/[0-9]{2}");
    let expiry_date_match = expiry_date_pattern.exec(expiry_date);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const expiryMonth = parseInt(expiry_date.split("/")[0]);
    let expiryYear = parseInt(expiry_date.split("/")[1]);
    expiryYear = parseInt((expiryYear < 70) ? ("20" + expiryYear.toString()) : ("19" + expiryYear.toString()));
    if (expiry_date_match === null || expiry_date_match.toString().length !== expiry_date.length || currentYear > expiryYear || (currentYear === expiryYear && currentMonth > expiryMonth) || !(expiryMonth >= 1 && expiryMonth <= 12)) {
        throw new InvalidCardDetailsError("Invalid expiry date format");
    }

    return "VALID";
}

const validateCard = (req, res, next) => {
    try {
        const { card_no, expiry_date, name_on_card } = req.body;
        if (![card_no, expiry_date, name_on_card].every(Boolean)) {
            throw new BadRequestError("Some card details are missing");
        }
        checkCardValidity(card_no, expiry_date);
        next();
    } catch (err) {
        console.log(err.stack);
        res.status(err.status || 500).send({ message: err.message });
    }
}

module.exports = {
    validateCard,
    checkCardValidity
}
