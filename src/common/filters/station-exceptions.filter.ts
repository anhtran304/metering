import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';

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
    } else if (exception instanceof BadRequestException) {
      response.status(201).json({
        status: 400,
        timestamp: new Date().toISOString(),
        message: 'Station Id is not correct in request',
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
