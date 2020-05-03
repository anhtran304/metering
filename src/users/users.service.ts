// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class UsersService {
//   private readonly users: any[];

//   constructor() {
//     this.users = [
//       {
//         userId: 1,
//         username: 'john',
//         password: 'changeme',
//         pet: { name: 'alfred', picId: 1 },
//       },
//       {
//         userId: 2,
//         username: 'chris',
//         password: 'secret',
//         pet: { name: 'gopher', picId: 2 },
//       },
//       {
//         userId: 3,
//         username: 'maria',
//         password: 'guess',
//         pet: { name: 'jenny', picId: 3 },
//       },
//     ];
//   }

//   async findOne(username: string): Promise<any> {
//     return this.users.find(user => user.username === username);
//   }
// }

import { Injectable } from '@nestjs/common';
import { pool } from '../dbConnection';
import sql = require('mssql');
import { UnauthorizedException } from '@nestjs/common';

export interface IUser {
  UserId: number;
  FirstName: string;
  LastName: string;
  FullName: string;
  Email: string;
  Password: string;
  Language: string;
  AvatarURL: string;
  DateTimeCreated: Date;
  isAtive: number;
}

@Injectable()
export class UsersService {
  private users: IUser[];
  async findOne(email: string): Promise<any> {
    const requestDB = pool.request(); // create request from pool
    // Query user from database with email address
    const data = await requestDB
      .input('iEmail', sql.NVarChar(50), email)
      .input('iIsAtive', sql.Bit, 1)
      .query(
        'select * from Users where Email = @iEmail and isActive = @iIsAtive',
      );
    if (!data) {
      throw new UnauthorizedException();
    } else {
      this.users = data.recordset;     
      return this.users.find(user => user.Email === email);
    }
  }
}


