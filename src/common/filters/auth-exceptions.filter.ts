import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Request, Response } from 'express';

export interface IResData {
  status: number;
  data: any;
  message: string;
}

@Catch(HttpException)
export class AuthExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let responseData: IResData = {
      status: 200,
      data: {},
      message: '',
    };

    if (
      exception instanceof UnauthorizedException ||
      exception instanceof ForbiddenException
    ) {
      // request.flash('loginError', 'Please try again!');
      responseData.status = 403;
      responseData.message = 'Password is not correct';
      response.status(200).send(responseData);
    } else {
      // response.redirect('/error');
    }
  }
}
