import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import { Response } from 'express';

import { OperationsGuard } from '../common/guards/operation.guard';
import { AuthExceptionFilter } from '../common/filters/auth-exceptions.filter';
import { Operations } from 'src/common/decorators/operations.decorator';
import { UsersService } from './users.service';

@UseGuards(OperationsGuard)
@Controller('/api/users')
@UseFilters(AuthExceptionFilter)
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get('/')
  @Operations('GET_ALL_USERS')
  getAll(@Res() res: Response) {
    this.usersService.findAllUsers().then((data) => {
      res.json({ users: data });
    });
  }
}
