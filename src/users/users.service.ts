import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { pool } from '../dbConnection';
import sql = require('mssql');
import { Body } from '@nestjs/common';
import bcrypt = require('bcrypt');
import { SALT_ROUNDS } from '../env'

export interface IUser {
  // UserId: number;
  FirstName: string;
  LastName: string;
  // FullName: string;
  Email: string;
  Password: string;
  // Language: string;
  // AvatarURL: string;
  // DateTimeCreated: Date;
  isAtive: number;
}

@Injectable()
export class UsersService {
  private user: IUser;
  private users: IUser[] = [];
  private operations: string[];

  // Find one user by email
  async findOneByEmail(email: string): Promise<any> {
    this.users = [];
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

  // Find all users in db
  async findAllUsers(): Promise<any> {
    this.users = [];
    const requestDB = pool.request(); // create request from pool
    // Query all user from database
    const dataUser = await requestDB.query(
      'select UserId, FullName, Email, DateTimeCreated, isActive from Users'
    );
    if (!dataUser.recordset) {
      throw new BadRequestException();
    } else {
      this.users = dataUser.recordset;
      return this.users;
    }
  }

  // Add one user
  async addOneUser(@Body() body): Promise<any> {
    let isExist: IUser;
    let hashedPassword: string = '';
    const requestDB = pool.request(); // create request from pool
    // Query user from database with email address
    const user = await requestDB
      .input('iEmail', sql.NVarChar(50), body.values.email)
      .input('iIsAtive', sql.Bit, 1)
      .query(
        'select * from Users where Email = @iEmail and isActive = @iIsAtive'
      );


    if (user && user.recordset.length > 0) {
      throw new ConflictException();
    } else {
      console.log('4');
      console.log(body.values.password);
      console.log(SALT_ROUNDS);
      hashedPassword = bcrypt.hashSync(body.values.password, SALT_ROUNDS);
      console.log(hashedPassword);
    }

    // let hashedPassword: string = '';
    // if (isExist) {
    //   throw new ConflictException();
    // } else {
    //   try {
    //     hashedPassword = await bcrypt.hash(body.values.password, SALT_ROUNDS, function(
    //       err,
    //       hashedPassword
    //     ) {
    //       return hashedPassword;
    //     });
    //   } catch (error) {
    //      throw new InternalServerErrorException();
    //   }
    // }

    
// {
//   values: {
//     firstName: 'a',
//     lastName: 'a',
//     email: 'a@gmail.com',
//     password: 'a',
//     isActive: 1,
//     confirmPassword: 'a'
//   },
//   roles: {
//     Admin: false,
//     'Group Manager': false,
//     Reporter: false,
//     'Data Manager': false,
//     Viewer: true
//   }
// }
    
  }

  // Find operation assigned to user
  async findOperations(email: string): Promise<any> {
    this.operations = [];
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


