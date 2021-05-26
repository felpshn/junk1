import mongoose from 'mongoose';
import express from 'express';
import routes from './routes/index';

import config from './config/index';

mongoose
  .connect(config.dbAccess!, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('\nDatabase connection established.'))
  .catch(err => console.error(err));

const app = express();
app.use(express.json());
app.use('/user', routes);

app.listen(3333, () => {
  console.log('\nServer is running.');
});
