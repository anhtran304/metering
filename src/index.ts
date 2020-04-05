import express from 'express';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import { AppRouter } from './AppRouter';
import './controllers/LoginController';
import './controllers/RootController';
import { SESSION_KEY } from './env';

const app = express();

app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({ extended: true }));
SESSION_KEY && app.use(cookieSession({ keys: [SESSION_KEY] }));
app.use(AppRouter.getInstance());
app.listen(3001, () => {
  console.log('Back end is listening on port 3001');
});
