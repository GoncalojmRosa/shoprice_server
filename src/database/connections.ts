import knex from 'knex';
import path from 'path';

const db = knex({
  client: 'postgres',
  connection: 'postgressql://postgres:12345@localhost:5432/shoprice',
  useNullAsDefault: true,
});

export default db;
