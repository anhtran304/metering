import { config } from 'mssql';
import sql = require('mssql');
import { DB_USER, DB_PASSWORD, DB_SERVER, DB_DATABASE } from '../env';

let config: config;
if (DB_USER && DB_PASSWORD && DB_SERVER && DB_DATABASE) {
  config = {
    user: DB_USER,
    password: DB_PASSWORD,
    server: DB_SERVER,
    database: DB_DATABASE,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
    },
    options: {
      enableArithAbort: true,
      encrypt: true,
    },
  };
} else {
  console.log('DB configuration is not set up correct');
}

export const pool = new sql.ConnectionPool(config);

export const poolConnect = pool
  .connect()
  .then(pool => {
    console.log('Connection to DB server has been established!');
    return pool;
  })
  .catch(err => console.log('Connection to DB server failed: ', err));
