import { Request, Response } from 'express';
import { get, post, controller, use, bodyValidator } from './decorators';
import { pool } from '../dbConnection';
import { NODE_ENV, ENV_VARIABLE } from '../env';
import { requireAuth, logToConsole } from './utils';

@controller('')
class RootController {
  @get('/')
  getRoot(req: Request, res: Response): void {
    if (req.session && req.session.userEmail) {
      console.log(req.session);
      res.send(`
      <div>
        <div>You are logged in</div>
        <a href="/auth/logout">Logout</a>
      </div>
      `);
    } else {
      res.send(`
      <div>
        <div>You are not logged in</div>
        <a href="/auth/login">Login</a>
      </div>
      `);
    }
  }

  @get('/protected')
  @use(requireAuth)
  getProtected(req: Request, res: Response): void {
    res.send('Welcome to protected route, logged in user');
  }
}
