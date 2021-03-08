const express = require('express');
const pool = require('./db');

const app = express();

app.use(express.json());

// test connection with backend
app.get('/', async (req, res) => {
   try {
      const users = await pool.query('SELECT * FROM users');
      res.json(users.rows);
   } catch (err) {
      console.log(err.message);
   }
});

// ROUTES   

// SIGNUP AND LOGIN ROUTES (/signup and /login)
app.use('/', require('./routes/jwtAuth'));

const PORT = 8080 || process.env.PORT;

// Express Server
app.listen(PORT, () => {
   console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
