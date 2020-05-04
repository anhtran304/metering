import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
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
  private user: IUser;
  private operations: string[];
  // Find one user by email
  async findOne(email: string): Promise<any> {
    const requestDB = pool.request(); // create request from pool
    // Query user from database with email address
    const dataUser = await requestDB
      .input('iEmail', sql.NVarChar(50), email)
      .input('iIsAtive', sql.Bit, 1)
      .query(
        'select * from Users where Email = @iEmail and isActive = @iIsAtive'
      );
    if (!dataUser.recordset) {
      throw new BadRequestException();
    } else if (dataUser.recordset.length === 0) {
      throw new NotFoundException();
    } else if (dataUser.recordset.length > 1) {
      throw new ConflictException();
    } else {
      this.user = dataUser.recordset[0];
      return this.user;
    }
  }
  // Find operation assigned to user
  async findOperations(email: string): Promise<any> {
    const dataOperation = await pool
      .request()
      .input('pEmail', sql.NVarChar(50), email)
      .execute('getOperationsByEmail');
    if (!dataOperation.recordset) {
      throw new NotFoundException();
    } else if (dataOperation.recordset.length === 0) {
      return this.operations;
    } else {
      this.operations = dataOperation.recordset.map(
        (operation) => operation.OperationName
      );
      return this.operations;
    }
  }
}


