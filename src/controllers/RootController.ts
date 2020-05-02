// import { Request, Response } from 'express';
// import { get, post, controller, use, bodyValidator } from './decorators';
// import { pool } from '../dbConnection';
// import { NODE_ENV, ENV_VARIABLE } from '../env';
// import { requireAuth, logToConsole } from './utils';
// import { IResData } from './model';
// import sql from 'mssql';

// @controller('/api')
// class RootController {
//   // @get('/api')
//   // getRoot(req: Request, res: Response): void {
//   //   if (req.session && req.session.userEmail) {
//   //     res.send(`
//   //     <div>
//   //       <div>You are logged in</div>
//   //       <a href="/auth/logout">Logout</a>
//   //     </div>
//   //     `);
//   //   } else {
//   //     res.send(`
//   //     <div>
//   //       <div>You are not logged in</div>
//   //       <a href="/auth/login">Login</a>
//   //     </div>
//   //     `);
//   //   }
//   // }

//   @get('/stations')
//   @use(requireAuth)
//   getStations(req: Request, res: Response): void {
//     let responseData: IResData = {
//       status: 200,
//       data: {},
//       message: '',
//     };
//     // try {
//     //   NODE_ENV === ENV_VARIABLE.development && logToConsole(req);
//     //     // Query to get all operation belong to user email
//     //   let operations = await pool
//     //       .request()
//     //       // .input('pEmail', sql.NVarChar(50), user.Email)
//     //       .execute('p_ViewAllStations')
//     //       .catch((err) => {
//     //   responseData.status = 400;
//     //   responseData.message = err;
//     //   res.status(200).send(responseData);
//     // // }
//   }
// }
