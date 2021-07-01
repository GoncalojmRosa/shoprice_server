import knex from 'knex';
import dotenv from 'dotenv'
dotenv.config();

const db = knex({
  client: 'postgres',
  connection: process.env.DATABASE_URL,
  useNullAsDefault: true,
});

export default db;
