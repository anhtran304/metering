import { Response, Request, NextFunction } from 'express';
import { get, post, controller, bodyValidator } from './decorators';
import { pool } from '../dbConnection';
import { NODE_ENV, ENV_VARIABLE } from '../env';
import { logToConsole } from './utils';
import bcrypt from 'bcrypt';
import sql from 'mssql';


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

    interface IResData {
      status: Number, 
      data: any,
      message: String
    };

    interface IUser {
      UserId: Number
      FirstName: String,
      LastName: String,
      FullName: String,
      Email: String,
      Password: String,
      Language: String,
      AvatarURL: String,
      DateTimeCreated: Date,
      isAtive: Number
    };

    interface IUserRole {
      RoleName: Number 
    };

    const { email, password } = req.body;
    let responseData: IResData = {
      status: 200, 
      data: '',
      message: ''
    };
    let userRoles: IUserRole[];
    
    try {
      const requestDB = pool.request(); // create request from pool
      let userRoles:IUserRole[];
      let user:IUser[];
      NODE_ENV === ENV_VARIABLE.development && logToConsole(req);

      const resultUser = await requestDB
        .input('iEmail', sql.NVarChar(50), email)
        .input('iIsAtive', sql.Bit, 1)
        .query(
          'select * from Users where Email = @iEmail and isActive = @iIsAtive'
        );

      user = resultUser.recordsets[0];

      if (user && user[0].UserId) {
        responseData.status = 200;
        responseData.data = user;
        responseData.message = 'Success found user';

        const resultUserRole = await requestDB
          .input('iUserId', sql.Int, user[0].UserId)
          .query(
          'select * from User_Role where UserId = @iUserId'
          );
        userRoles = resultUserRole.recordsets[0];
        req.session = { roles: userRoles }
        console.log(userRoles);

      } else {
        responseData.status = 404;
        responseData.message = `No user with ${email}`;
      };

      req.session = { loggedIn: true, userEmail : user[0].Email };
      res.status(200).send(responseData);
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
