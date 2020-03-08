import sql, { config } from 'mssql';
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
      idleTimeoutMillis: 30000
    },
    options: {
      enableArithAbort: true,
      encrypt: true
    }
  };
} else {
  console.log('DB configuration is not set up correct');
}

// async/await style:

// if (config.database && config.password && config.server && config.user) {
//   const pool1 = new sql.ConnectionPool(config);
// }
export const pool = new sql.ConnectionPool(config);

export const poolConnect = pool
  .connect()
  .then(pool => {
    console.log('Connection established to DB server');
    return pool;
  })
  .catch(err => console.log('Connection to DB server failed: ', err));
