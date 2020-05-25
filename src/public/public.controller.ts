import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseFilters,
  Param,
  BadRequestException
} from '@nestjs/common';
import { Response } from 'express';

import { PublicExceptionFilter } from '../common/filters/public-exceptions.filter';
import { Operations } from 'src/common/decorators/operations.decorator';
import { StationsService } from '../stations/stations.service';


@Controller('/api/public')
@UseFilters(PublicExceptionFilter)
export class PublicController {
  constructor(private stationsService: StationsService) { }
  @Get('/allstationnames')
  getAll(@Res() res: Response) {
    // console.log(this.stationsService.findAllStations());
    this.stationsService.findAllStations().then((data) => {
      res.json({ stations: data });
    });
  }

}