import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class RoleExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    if (exception instanceof NotFoundException) {
      response.status(201).json({
        status: 404,
        timestamp: new Date().toISOString(),
        message: 'Can not find any roles',
      });
    } else {
      response.status(201).json({
        status: 403,
        timestamp: new Date().toISOString(),
        message: 'Error in role services',
      });
    }
  }
}
