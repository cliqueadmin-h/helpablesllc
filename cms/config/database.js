// See https://docs.strapi.io/dev-docs/configurations/database

module.exports = ({ env }) => ({
  connection: {
    client: 'sqlite',
    connection: {
      filename: env('DATABASE_FILENAME', '.tmp/data.db'),
    },
    useNullAsDefault: true,
    debug: false,
  },
});
