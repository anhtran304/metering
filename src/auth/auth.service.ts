import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    const operations = await this.usersService.findOperations(email);
    if (user && user.Password === pass) {
      const { Password, ...result } = user;
      if (operations) {
        result.operations = operations;
      }
      return result;
    }
    return null;
  }
}
