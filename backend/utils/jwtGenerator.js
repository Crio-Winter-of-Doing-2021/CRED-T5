const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (user_id) => {
    const payload = {
        user_id: user_id
    };
    return jwt.sign(payload, process.env.jwtSecret, {expiresIn: '24hr'});
}