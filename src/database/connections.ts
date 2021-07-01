import knex from 'knex';
import path from 'path';

const db = knex({
  client: 'postgres',
  connection:  'postgres://quckneotpfwybn:80fc63bb93088634b2ff2c91faa5e156f802c7de35c08ad73c43fa2afe2f66ac@ec2-54-216-48-43.eu-west-1.compute.amazonaws.com:5432/d4cb7cps4q4hao',
  useNullAsDefault: true,
});

export default db;
