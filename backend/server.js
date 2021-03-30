const express = require('express');
const cors = require('cors');
const pool = require('./db');
const cron = require('node-cron');
const nodemailer = require('nodemailer');

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

// SCHEDULING 
cron.schedule('* * * * *', async () => {
   try {
      let date = new Date();
      let hour = date.getHours().toString();
      let day_of_month = date.getDate().toString();
      let minutes = date.getMinutes().toString();
      if (hour.length === 1) hour = "0" + hour;
      if (date.length === 1) date = "0" + date;
      if (minutes.length === 1) minutes = "0" + minutes;
      const currentTime = `${day_of_month}-${hour}-${minutes}`;
      // console.log(currentTime);
      const data = await pool.query(`SELECT * FROM reminder_schedule WHERE reminder_time = '${currentTime}'`);
      // console.log(data.rows);
      const scheduled_reminders = data.rows;
      scheduled_reminders.forEach(async (reminder) => {
         try {
            // reminer contains reminder_time, card_id and reminder_id
            // now first extract user_id for the card_id
            const user = await pool.query(`SELECT card_user_id FROM cards WHERE card_id = '${reminder.reminder_card_id}'`);
            const user_email = await pool.query(`SELECT email FROM users WHERE user_id = '${user.rows[0].card_user_id}'`);
            // console.log(user_email.rows[0].email);
            const send_to_email = user_email.rows[0].email;
            const transporter = nodemailer.createTransport({
               service: 'gmail',
               auth: {
                  user: process.env.NODEMAILER_AUTH_EMAIL,
                  pass: process.env.NODEMAILER_AUTH_PASS
               }
            });
            const mailOptions = {
               from: process.env.NODEMAILER_AUTH_EMAIL,
               to: send_to_email,
               subject: 'Reminder for paying bill before due date',
               text: 'This is a reminder'
            };
            transporter.sendMail(mailOptions, function (error, info) {
               if (error) {
                  console.log(error);
               } else {
                  console.log('Email sent: ' + info.response);
               }
            });
         } catch (err) {
            console.log(err.message);
         }
      });
   } catch (err) {
      console.log(err.message);
      res.status(500).send({ message: "Internal Server Error" });
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

// REMINDER ROUTE
app.use('/cards/:id/reminder', (req, res, next) => {
   req.card_id = req.params.id;
   next();
});
app.use('/cards/:id/reminder', require('./routes/reminder'));

// 404 ROUTE
app.use('*', (req, res) => {
   return res.status(404).send({ message: "Not Found" });
});

const PORT = 8080 || process.env.PORT;

// Express Server
app.listen(PORT, () => {
   console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
