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

import { LoginGuard } from '../common/guards/login.guard';
import { AuthenticatedGuard } from '../common/guards/authenticated.guard';
import { AuthExceptionFilter } from '../common/filters/auth-exceptions.filter';

export interface IResData {
  status: Number;
  data: any;
  message: String;
}

@Controller('/api/auth')
@UseFilters(AuthExceptionFilter)
export class AuthController {
  @UseGuards(LoginGuard)
  @Post('/login')
  login(@Res() res: Response, @Req() req) {
    const user = req.user;
    res.json({
      status: 200,
      data: {
        operationNames: user.operations,
        email: user.Email,
        fullName: user.FullName,
        avatarURL: user.AvatarURL,
      },
      message: `Successful find user and operations`,
    });
  }
}
