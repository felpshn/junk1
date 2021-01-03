const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();

const signInRoute = require('./routes/signIn');
const postRoute = require('./routes/posts');

const mongoose = require('mongoose');
mongoose
  .connect(process.env.DB_ACCESS, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('\nDatabase connection established.\n'))
  .catch(err => console.error(err));

app.use(express.json());

// Route Middlewares
app.use('/api/user', signInRoute);
app.use('/api/posts', postRoute);

app.listen(3000, () => {
  console.log('\nServer is running.');
});
