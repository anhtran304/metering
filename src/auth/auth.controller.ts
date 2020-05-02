import { Controller, Get, Post, Res, Render, UseGuards, Req } from '@nestjs/common';
import { Response, Request } from 'express';

import { LoginGuard } from '../common/guards/login.guard';
import { AuthenticatedGuard } from '../common/guards/authenticated.guard';
@Controller('/api/auth')
export class AuthController {
  // @UseGuards(LoginGuard)
  @Post('/login')
  login(@Req() req: Request , @Res() res: Response) {      
    console.log(req.body);
    res.redirect('/home');
  }

  @UseGuards(AuthenticatedGuard)
  @Get('/profile')
  @Render('profile')
  getProfile(@Req() req) {
    return { user: req.user };
  }

  @Get('/logout')
  logout(@Req() req, @Res() res: Response) {
    req.logout();
    res.redirect('/');
  }
}