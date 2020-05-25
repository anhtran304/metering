import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  NotFoundException,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class PublicExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof NotFoundException || exception instanceof BadRequestException) {
      response.status(201).json({
        status: 404,
        timestamp: new Date().toISOString(),
        message: 'Can not find user',
      });
    } else if (exception instanceof ConflictException) {
      response.status(201).json({
        status: 409,
        timestamp: new Date().toISOString(),
        message: 'Two many user with the same email',
      });
    } else if (exception instanceof UnauthorizedException) {
      response.status(201).json({
        status: 400,
        timestamp: new Date().toISOString(),
        message: 'Email and password might not correct',
      });
    } else {
      response.status(201).json({
        status: 403,
        timestamp: new Date().toISOString(),
        message: 'Error in user services',
      });
    }
  }
}
