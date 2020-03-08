import { Request, Response, NextFunction } from 'express';
import { get, controller, use } from './decorators';
import { pool } from '../dbConnection';
import { NODE_ENV } from '../env';

function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (req.session && req.session.loggedIn) {
    next();
    return;
  } else {
    res.status(403);
    res.send('Not permitted');
  }
}

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

  @get('/db')
  async testConnection(req: Request, res: Response) {
    try {
      const request = pool.request(); // create request from pool
      const result = await request.query('select * from users');
      NODE_ENV === 'develop' &&
        console.log(`GET | url: /db | by: | at: ${Date()}`);
      res.send(result.recordsets);
    } catch (err) {
      console.error('SQL statement error: ', err);
      res.send('Sorry our DB is down');
    }
  }
}
