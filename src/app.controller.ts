import {
  Controller,
  Get,
  Post,
  Request,
  Res,
  Render,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import { Response } from 'express';

import { LoginGuard } from './common/guards/login.guard';
import { AuthenticatedGuard } from './common/guards/authenticated.guard';
import { AuthExceptionFilter } from './common/filters/auth-exceptions.filter';

@Controller()
@UseFilters(AuthExceptionFilter)
export class AppController {

  @Get('/')
  @Render('login')
  index(@Request() req): { message: string } {
    return { message: req.flash('loginError') };
  }

  // @UseGuards(LoginGuard)
  // @Post('/login')
  // login(@Res() res: Response, @Request() req) {
  //   console.log(req.user);
  //   res.redirect('/home');
  // }

  @UseGuards(LoginGuard)
  @Post('/api/auth/login')
  login(@Res() res: Response) {
    res.json({ status: 200, data: 'no', message: 'Good', fullName: 'Anh Tran'});
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/home')
  @Render('home')
  getHome(@Request() req) {
    return { user: req.user };
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/profile')
  @Render('profile')
  getProfile(@Request() req) {
    return { user: req.user };
  }

  @Get('/logout')
  logout(@Request() req, @Res() res: Response) {
    req.logout();
    res.redirect('/');
  }
}
