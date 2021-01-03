const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();

const authRoute = require('./routes/auth');

const mongoose = require('mongoose');
mongoose
  .connect(process.env.DB_ACCESS, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('\nDatabase connection established.\n'))
  .catch(err => console.error(err));

app.use(express.json());

// Route Middlewares
app.use('/api/user', authRoute);

app.listen(3000, () => {
  console.log('\nServer is running.');
});
