// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/palettePicker',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      './db/seeds/dev'
    },
    useNullAsDefault: true
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL + `?ssl=true`,
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      './db/seeds/dev'
    },
    useNullAsDefault: true
  }

};
