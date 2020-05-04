import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class StationExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    if ( exception instanceof NotFoundException ) {
      response.status(201).json({
        status: 404,
        timestamp: new Date().toISOString(),
        message: 'Can not find any stations',
      });
    } else {
      response.status(201).json({
        status: 403,
        timestamp: new Date().toISOString(),
        message: 'Error in station services',
      });
    }
  }
}
