const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();

app.use(express.json());
app.use(cors());

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

// DASHBOARD ROUTE
app.use('/cards', require('./routes/card'));

// SMART STATEMENT ROUTES
app.use('/cards/:id/statements/smart', (req, res, next) => {
   req.card_id = req.params.id;
   next();
});
app.use('/cards/:id/statements/smart', require('./routes/smartStatement'));

// STATEMENTS ROUTES
app.use('/cards/:id/statements', (req, res, next) => {
   req.card_id = req.params.id;
   next();
});
app.use('/cards/:id/statements', require('./routes/statements'));

// PAYMENT ROUTE
app.use('/cards/:id/pay', (req, res, next) => {
   req.card_id = req.params.id;
   next();
});
app.use('/cards/:id/pay', require('./routes/pay'));

// 404 ROUTE
app.use('*', (req, res) => {
   return res.status(404).send({ message: "Not Found" });
});

const PORT = process.env.PORT || 8080;

// Express Server
app.listen(PORT, () => {
   console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
