import { Injectable } from '@nestjs/common';
import { IUser } from './models';
import { pool } from '../dbConnection';
import sql = require('mssql');
import {
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class UsersService {
  private readonly users: IUser[];

  async findOne(email: string): Promise<any> {

  const requestDB = pool.request(); // create request from pool
  // Query user from database with email address
  const users = await requestDB
    .input('iEmail', sql.NVarChar(50), email)
    .input('iIsAtive', sql.Bit, 1)
    .query(
      'select * from Users where Email = @iEmail and isActive = @iIsAtive'
    );
    if (!users) {
      throw new UnauthorizedException();
    }
    console.log(users);
    return this.users.find((user) => user.Email === email);
  }
}


