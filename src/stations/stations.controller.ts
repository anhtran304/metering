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
import { StationExceptionFilter } from '../common/filters/station-exceptions.filter';
import { Operations } from 'src/common/decorators/operations.decorator';
import { StationsService } from './stations.service';


@UseGuards(OperationsGuard)
@Controller('/api/stations')
@UseFilters(StationExceptionFilter)
export class StationsController {
  constructor(private stationsService: StationsService) { }
  @Get('/')
  @Operations('GET_ALL_STATIONS')
  getAll(@Res() res: Response) {
    // console.log(this.stationsService.findAllStations());
    this.stationsService.findAllStations().then((data) => {
      res.json({stations: data});       
    })
  }
}
