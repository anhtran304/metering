import { Request, Response } from 'express';
import { get, controller, use } from './decorators';
import { pool } from '../dbConnection';
import { NODE_ENV, ENV_VARIABLE } from '../env';
import { requireAuth, logToConsole, cors } from './utils';

@controller('')
class RootController {
  @get('/')
  getRoot(req: Request, res: Response): void {
    if (req.session && req.session.loggedIn) {
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

  // TESTING CONNECTION TO DB
  @get('/api/db')
  @use(cors)
  async testConnection(req: Request, res: Response) {
    try {
      const request = pool.request(); // create request from pool
      const result = await request.query(
        'select UserId, FirstName, LastName, DateTimeCreated from Users'
      );

      NODE_ENV === ENV_VARIABLE.development && logToConsole(req);
      // result.recordsets[0] is aray of users
      res.send(result.recordsets[0]);
    } catch (err) {
      console.error('SQL statement error: ', err);
      res.send('Sorry our DB is down');
    }
  }
}
