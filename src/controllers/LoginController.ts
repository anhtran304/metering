import { Response, Request, NextFunction } from 'express';
import { get, post, controller, bodyValidator } from './decorators';
import { pool } from '../dbConnection';
import { NODE_ENV, ENV_VARIABLE } from '../env';
import { logToConsole } from './utils';
import bcrypt from 'bcrypt';
import sql from 'mssql';

interface IResData {
  status: Number;
  data: any;
  message: String;
}
interface IUser {
  UserId: Number;
  FirstName: String;
  LastName: String;
  FullName: String;
  Email: String;
  Password: String;
  Language: String;
  AvatarURL: String;
  DateTimeCreated: Date;
  isAtive: Number;
}
interface IUserRole {
  RoleName: Number;
}

@controller('/api/auth')
class LoginController {
  @get('/login')
  getLogin(req: Request, res: Response): void {
    res.send(`
    <form method="POST">
        <div>
            <label>Email</label>
            <input name="email"/>
        </div>
        <div>
            <label>Password</label>
            <input name="password" type="password"/>
        </div>
        <button>Submit</button>
    </form>
    `);
  }

  @post('/login')
  @bodyValidator('email', 'password')
  async postLogin(req: Request, res: Response) {
    // const { email, password } = req.body;
    // if (email === 'hi@hi.com' && password === 'pwd') {
    //   req.session = { loggedIn: true };
    //   res.redirect('/');
    // } else {
    //   res.send('Invalid email or password');
    // }

    let responseData: IResData = {
      status: 200,
      data: '',
      message: '',
    };
    const { email, password } = req.body;
    try {
      NODE_ENV === ENV_VARIABLE.development && logToConsole(req);
      const requestDB = pool.request(); // create request from pool
      // Query user from database
      const resultUser = await requestDB
        .input('iEmail', sql.NVarChar(50), email)
        .input('iIsAtive', sql.Bit, 1)
        .query(
          'select * from Users where Email = @iEmail and isActive = @iIsAtive'
        );
      // Check if query return a record of user
      if (resultUser.recordset[0]) {
        let user:IUser = resultUser.recordset[0];
        if ((user.Password !== password)) {
          responseData.status = 403;
          responseData.message = 'Password is not correct';
          res.status(200).send(responseData);
        } else {
          // Query to get all operation by email
          let operation = await pool
            .request()
            .input('pEmail', sql.NVarChar(50), user.Email)
            .execute('getOperationsByEmail')
            .then((result) => result.recordset)
            .catch((err) => {
              responseData.status = 400;
              responseData.message = err;
              res.status(200).send(responseData);
            });
          if (operation && operation.length > 0) {
            req.session = { userEmail: user.Email, operation: operation };                        
          } else {
            responseData.status = 200;
            responseData.message = 'User is not assigned to any operation';
            res.status(200).send(responseData);
          }
        }
      } else {
        responseData.status = 404;
        responseData.message = `Not found user with ${email}`;
        res.status(200).send(responseData);
      }
    } catch (err) {
      console.log(err);
      res.send('Sorry our Database could not response for now');
    }
  }

  @get('/logout')
  getLogout(req: Request, res: Response): void {
    req.session = undefined;
    res.redirect('/');
  }
}
