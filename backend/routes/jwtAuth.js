const router = require('express').Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwtGenerator = require('../utils/jwtGenerator');

// const jwtGenerator = require('../utils/jwtGenerator');

router.post('/signup', require('../middleware/validate'), async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;

        // Check db if user already exists
        const user = await pool.query(`SELECT * FROM users WHERE email = '${email}'`);
        if (user.rows.length) {
            return res.status(409).send("Email already in use!");
        }

        // If user does not already exist, hash password
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const bcryptPassword = await bcrypt.hash(password, salt);

        // Save user in database
        const newUser = await pool.query(`INSERT INTO users(user_id, first_name, last_name, email, password) VALUES('${uuidv4()}', '${first_name}', '${last_name}', '${email}', '${bcryptPassword}') RETURNING *`);

        // Send back jwt token
        const access_token = jwtGenerator(newUser.rows[0].user_id);
        res.status(201).json({ access_token });

    } catch (err) {
        console.log(err.message);
        res.status(500).send("Internal Sever Error");
    }
})

module.exports = router;
