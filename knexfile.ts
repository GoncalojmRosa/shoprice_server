module.exports = {
    // development: {
      client: 'postgres',
      connection: 'postgressql://postgres:12345@localhost:5432/shoprice',
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