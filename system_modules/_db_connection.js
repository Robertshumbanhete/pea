function db_conn(sql, parameters) {
  return new Promise((resolve, reject) => {
    const { createPool } = require("mysql");

    const pool = createPool({
      host: process.env.DATABASE_HOST,
      database: process.env.DATABASE,
      port: "3306",
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      connectionLimit: 10,
    });
    pool.query(sql, parameters, (err, results, fields) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }

      pool.end(function (err) {
        // all connections in the pool have ended
      });
    });
  });
}

function db_conn_remote(sql, parameters) {
  return new Promise((resolve, reject) => {
    const { createPool } = require("mysql");

    const pool = createPool({
      host: process.env.REMOTE_DATABASE_HOST,
      database: process.env.REMOTE_DATABASE,
      user: process.env.REMOTE_DATABASE_USER,
      password: process.env.REMOTE_DATABASE_PASSWORD,
      connectionLimit: 10,
    });
    pool.query(sql, parameters, (err, results, fields) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }

      pool.end(function (err) {
        // all connections in the pool have ended
      });
    });
  });
}

module.exports = { db_conn, db_conn_remote };
