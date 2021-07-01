import dotenv from 'dotenv'
dotenv.config();

module.exports = {
    // development: {
      client: 'postgres',
      connection: process.env.DATABASE_URL || 'postgressql://postgres:12345@localhost:5432/shoprice',,
      migrations: {
        tableName: 'knex_migrations',
        directory: `./src/database/migrations`
      },
      seeds: { 
        directory: './src/database/seeds'
      },
      useNullAsDefault: true,
    // }
  };