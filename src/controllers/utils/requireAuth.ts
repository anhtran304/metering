// import { Request, Response, NextFunction } from 'express';

// interface IOperationName {
//   Email: string,
//   RoleName: string,
//   OperationId: number,
//   Method: string,
//   OperationName: string,
//   OperationURL: string  
// }

// export function requireAuth(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): void {
//   if (req.session && req.session.userEmail) {
//   const isAuth = req.session.operationNames.filter(
//     (operationName: IOperationName) =>
//       (operationName.Method === req.method &&
//       operationName.OperationURL === req.route.path)
//   );
//     if (isAuth) {
//       next();
//       return;
//     }
//   } else {
//     res.status(403);
//     res.send('Not permitted');
//   }
// }
