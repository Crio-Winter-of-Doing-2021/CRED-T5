const express = require('express');

const app = express();

app.get('/', (req, res) => {
   res.send('<h1>Hello from backend</h1>');
});

const PORT = 8080 || process.env.PORT;

// Express Server
app.listen(PORT, () => {
   console.log(`Server is running at port: ${PORT}`);
});
