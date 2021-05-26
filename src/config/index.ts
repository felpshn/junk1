import dotenv from 'dotenv';

dotenv.config();

export default {
  dbAccess: process.env.DB_ACCESS,
  tokenSecret: process.env.TOKEN_SECRET
}
