import dotenv from 'dotenv';

import mongoose from 'mongoose';

import express from 'express';

import routes from './api/routes';

dotenv.config();

mongoose
  .connect(process.env.DB_ACCESS!, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('\nDatabase connection established.'))
  .catch(err => console.error(err));

const app = express();
app.use(express.json());
app.use('/api/user', routes);

app.listen(3000, () => {
  console.log('\nServer is running.');
});
