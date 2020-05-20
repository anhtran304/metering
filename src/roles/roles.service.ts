import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { pool } from '../dbConnection';

export interface IRole {
  UserId: number;
  RoleName: string;
}

@Injectable()
export class RolesService {
  private roles: IRole[] = [];
  // Find all roles
  async findAllRoles(): Promise<any> {
    this.roles = [];
    const requestDB = pool.request(); // create request from pool
    // Query all role from database
    const data = await requestDB.query(
      'select RoleName from Roles'
    );
    if (!data.recordset) {
      throw new BadRequestException();
    } else if (data.recordset.length === 0) {
      throw new NotFoundException();
    } else {
      this.roles = data.recordset;
      return this.roles;
    }
  }
}
