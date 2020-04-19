import * as dotenv from 'dotenv';

export enum ENV_VARIABLE {
  development = 'development',
  production = 'production'
}

dotenv.config();
let path = `${__dirname}/../../.env`;
dotenv.config({ path: path });

export const SESSION_KEY = process.env.SESSION_KEY || undefined;
export const DB_USER = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_SERVER = process.env.DB_SERVER;
export const DB_DATABASE = process.env.DB_DATABASE;
export const NODE_ENV = process.env.NODE_ENV;