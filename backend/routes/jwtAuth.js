const router = require('express').Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwtGenerator = require('../utils/jwtGenerator');

router.post('/signup', require('../middleware/validate'), async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;

        // Check db if user already exists
        const user = await pool.query(`SELECT * FROM users WHERE email = '${email}'`);
        if (user.rows.length) {
            return res.status(409).send({ message: "Email already in use!" });
        }

        // If user does not already exist, hash password (do before final deployment)
        // const saltRound = 10;
        // const salt = await bcrypt.genSalt(saltRound);
        // const bcryptPassword = await bcrypt.hash(password, salt);

        // Save user in database
        const newUser = await pool.query(`INSERT INTO users(first_name, last_name, email, password) VALUES('${first_name}', '${last_name}', '${email}', '${password}') RETURNING *`);

        // Send back user_id of the registered user
        res.status(201).send({ user_id: newUser.rows[0].user_id });


    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: "Internal Sever Error" });
    }
});

router.post('/login', require('../middleware/validate'), async (req, res) => {
    console.log(req.body);
    try {
        const { email, password } = req.body;
        // check if user exists in database. If not, return status code 401
        const user = await pool.query(`SELECT * FROM users WHERE email = '${email}'`);
        if (user.rows.length === 0) {
            return res.status(401).send({ message: "Email or password is incorrect" });
        }

        // if the user exists, match the entered password with the password in database
        if (user.rows[0].password !== password) {
            return res.status(401).send({ message: "Password Incorrect" }); // delete this code and uncomment below code before final submission
        }

        // # Uncomment the below three lines only when hashing is to be enabled for the passwords
        // const validPassword = await bcrypt.compare(password, user.rows[0].user_password);
        // if (!validPassword) {
        //     return res.status(401).send("Email or password is incorrect");
        // }

        // Return the jwt token
        const access_token = jwtGenerator(user.rows[0].user_id);
        res.status(200).send({ access_token });
    }
    catch (err) {
        console.log(err.message);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

router.post('/verify', require('../middleware/auth'), async (req, res) => {
    try {
        res.json(true);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router;
