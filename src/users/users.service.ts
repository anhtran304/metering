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
import { async } from 'rxjs/internal/scheduler/async';
var validator = require('validator');
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
    const requestDB = pool.request(); // create request from pool
    // Query user from database with email address
    let hashedPassword:string = '';
    if (!body.values) {
      throw new BadRequestException();
    } else {
      const isEmail = validator.isEmail(body.values.email);
      let isPassword: boolean = false;
      let roles: string[] = [];
      if (body.values.password && body.values.confirmPassword) {
        body.values.password === body.values.confirmPassword
          ? (isPassword = true)
          : (isPassword = false);
      }
      if (body.roles) {
        const rolesData = Object.entries(body.roles);
        for (const [roleName, isTrue] of rolesData) {
          if (isTrue) roles.push(roleName);
        }
      }
      const user = await requestDB
        .input('iEmail', sql.NVarChar(50), body.values.email)
        .input('iIsAtive', sql.Bit, 1)
        .query(
          'select * from Users where Email = @iEmail and isActive = @iIsAtive'
        );
      if (user && user.recordset.length > 0) {
        throw new ConflictException(); // email is exist in the system
      } else {
        const salt = bcrypt.genSaltSync(Number(SALT_ROUNDS));
        hashedPassword = bcrypt.hashSync(body.values.password, salt);
        if (isEmail && isPassword && roles.length > 0 && hashedPassword) {
          this.users = [];
          const requestDB = pool.request(); // create request from pool
          // Query all user from database
          const dataUser = await pool
            .request()
            .input('FirstName', sql.NVarChar(50), body.values.firstName)
            .input('LastName', sql.NVarChar(50), body.values.lastName)
            .input('Email', sql.NVarChar(50), body.values.email)
            .input('Password', sql.NVarChar(100), hashedPassword)
            .input('isActive', sql.Bit, body.values.isActive)
            .execute('p_InsertOneUser');
          let dataRole;
          if (!dataUser.recordset) {
            throw new BadRequestException();
          } else {
            const promises = roles.map((roleName) => {
              return new Promise((resolve, reject) => {
                pool
                  .request()
                  .input('Email', sql.NVarChar(50), body.values.email)
                  .input('RoleName', sql.NVarChar(50), roleName)
                  .execute('p_InsertRoleForUser');
              });
            });
            await Promise.all(promises).then(function(values) {
              dataRole = values;
            });
            this.users = dataUser.recordset;
            return this.users;
          }
        }
      }
    }

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


