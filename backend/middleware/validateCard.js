const checkCardValidity = (card_no, expiry_date) => {
    const card_no_pattern = new RegExp("[0-9]{16}");
    let card_no_match = card_no_pattern.exec(card_no);
    // Luhn validation
    let sum = 0;
    for (let i = 15; i >= 0; --i) {
        let digit = parseInt(card_no.charAt(i));
        sum += (i & 1) ? digit : (digit === 9 ? digit : (2 * digit) % 9);
    }
    if (card_no_match === null || card_no_match.toString().length !== card_no.length || (sum % 10) !== 0) {
        return { status: "INVALID", message: "Invalid card number" };
    }

    const expiry_date_pattern = new RegExp("[0-9]{2}/[0-9]{4}");
    let expiry_date_match = expiry_date_pattern.exec(expiry_date);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const expiryMonth = parseInt(expiry_date.split("/")[0]);
    const expiryYear = parseInt(expiry_date.split("/")[1]);
    if (expiry_date_match === null || expiry_date_match.toString().length !== expiry_date.length || currentYear > expiryYear || (currentYear === expiryYear && currentMonth > expiryMonth) || !(expiryMonth >= 1 && expiryMonth <= 12)) {
        return { status: "INVALID", message: "Invalid expiry date format" };
    }

    return { status: "VALID" };
}

module.exports = (req, res, next) => {
    try {
        const { card_no, expiry_date, name_on_card } = req.body;
        if (![card_no, expiry_date, name_on_card].every(Boolean)) {
            return res.status(400).send({ message: "Missing Credentials" });
        }
        let result = checkCardValidity(card_no, expiry_date);
        if (result.status === "INVALID") {
            return res.status(400).send({ message: result.message });
        }
        next();
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({ message: "Internal Server Error" });
    }
}
