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


@UseGuards(OperationsGuard)
@Controller('/api/stations')
@UseFilters(AuthExceptionFilter)
export class StationsController {
  @Get('/')
  @Operations('GET_ALL_STATIONS')
  getAll(@Res() res: Response) {
    res.json('abc');
  }
}
