const { Pool } = require("pg");

module.exports = new Pool({
  user: "postgres",
  password: "dskcn",
  host: "localhost",
  port: 5432,
  database: "launchstore",
});
