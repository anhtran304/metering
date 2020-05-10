import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    const operations = await this.usersService.findOperations(email);
    // let correctPass: boolean = false;
    let test;
    if (user) {
      test = bcrypt.compare(pass, user.Password).then(function(resultHash) {
        if (resultHash) {
          const { Password, ...result } = user;            
          if (operations) {
            result.operations = operations;
          }
          console.log(result);
          return result;
        }
      });
    }

    if (test) {
      return test
    } return null;


    // if (user && user.Password === pass) {
    //   const { Password, ...result } = user;
    //   if (operations) {
    //     result.operations = operations;
    //   }
    //   return result;
    // }
    // return null;
  }
}
