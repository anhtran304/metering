import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UseFilters,
  Param,
  BadRequestException
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

  @Get('/:stationId')
  @Operations('GET_ONE_STATIONDETAILS')
  getOneStationDetails(@Res() res: Response, @Param() params) {
    if (params.stationId) {
      this.stationsService.getOneStationDetails(params).then((data) => {
        res.json({ stationDetails: data });
      })
    } else {
      throw new BadRequestException();
    }
  }

  @Get('/:meterNMI')
  @Operations('GET_ONE_LOGICALMETERNMIDETAILS')
  getOneLogicalMeterNMDetails(@Res() res: Response, @Param() params) {
    if (params.satationId && params.meterNMI) {
      this.stationsService.getOneLogicalMeterNMIDetails(params).then((data) => {
        res.json({ logicalMeterNMDetails: data });
      })
    } else {
      throw new BadRequestException();
    }
  }
}
