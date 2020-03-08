import * as dotenv from 'dotenv';

dotenv.config();
let path = `${__dirname}/../../.env`;

dotenv.config({ path: path });

export const SESSION_KEY = process.env.SESSION_KEY || undefined;
export const DB_USER = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_SERVER = process.env.DB_SERVER;
export const DB_DATABASE = process.env.DB_DATABASE;
