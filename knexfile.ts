import path from 'path';

module.exports = {
    development: {
      client: 'sqlite3',
      connection: {
        filename: path.resolve(__dirname, 'src', 'database', 'database.sqlite'),
      },
      migrations: {
        tableName: 'knex_migrations',
        directory: `${__dirname}/src/database/migrations`
      },
      useNullAsDefault: true,
    }
  };