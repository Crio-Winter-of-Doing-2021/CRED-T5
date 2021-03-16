const checkStatementValidity = (year, month) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    if (currentMonth !== 1 && year === currentYear && month === (currentMonth - 1)) {
        return { status: 'VALID' };
    }
    else if (currentMonth === 1 && year === (currentYear - 1) && month === 12) {
        return { status: 'VALID' };
    }
    else return { status: 'INVALID', message: 'Invalid Year or Month' };
}

module.exports = (req, res, next) => {
    try {
        const { net_amount, transactions } = req.body;
        if (![net_amount, transactions].every(Boolean)) { // checks presence of each required field
            return res.status(400).send({ message: "Missing Credentials" });
        }
        if (typeof (transactions.length) === "undefined") { // checks that transactions is an array
            return res.status(400).send({ message: "Missing or Invalid Credentials" });
        }
        const validity = checkStatementValidity(parseInt(req.params.year), parseInt(req.params.month)); // for checking year and month validity
        if (validity.status === "INVALID") {
            return res.status(400).send({ message: validity.message });
        }
        let sum = 0;
        // now check validity of each transaction
        for (let i = 0; i < transactions.length; i++) {
            const transaction = transactions[i];
            const { amount, type } = transaction;
            if (![amount, type].every(Boolean)) {
                return res.status(400).send({ message: "Missing Credentials" });
            }
            if (!(type === 'D' || type === 'C')) {
                return res.status(400).send({ message: "Invalid Transcation Type" });
            }
            if (type == 'D') sum += amount;
            else sum -= amount;
        }
        if (sum != net_amount) {
            return res.status(400).send({ message: "Statement and transaction amounts do not match" });
        }
        // reaching here means all transactions are valid
        next();
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({ message: "Internal Server Error" });
    }
}