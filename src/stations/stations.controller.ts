import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UseFilters,
  Param,
  BadRequestException,
  Body,
  UseInterceptors,
  UploadedFile,
  NotFoundException
} from '@nestjs/common';
import { Response } from 'express';
import { diskStorage } from 'multer';

import { OperationsGuard } from '../common/guards/operation.guard';
import { StationExceptionFilter } from '../common/filters/station-exceptions.filter';
import { Operations } from 'src/common/decorators/operations.decorator';
import { StationsService } from './stations.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';

@UseGuards(OperationsGuard)
@Controller('/api/stations')
@UseFilters(StationExceptionFilter)
export class StationsController {
  constructor(private stationsService: StationsService) {}
  @Get('/')
  @Operations('GET_ALL_STATIONS')
  getAll(@Res() res: Response) {
    // console.log(this.stationsService.findAllStations());
    this.stationsService
      .findAllStations()
      .then((data) => {
        res.json({ stations: data });
      })
      .catch((error) => res.json({ stations: null, message: error }));
  }

  @Get('/:stationId')
  @Operations('GET_ONE_STATIONDETAILS')
  getOneStationDetails(@Res() res: Response, @Param() params) {
    if (params.stationId) {
      this.stationsService
        .getOneStationDetails(params)
        .then((data) => {
          res.json({ stationDetails: data });
        })
        .catch((error) => res.json({ stationDetails: null, message: error }));
    } else {
      res.json({
        stationDetails: null,
        message: 'Request data is not correct',
      });
    }
  }

  @Get('/:stationId/:meterNMI')
  @Operations('GET_ALL_LOGICAL_METER_NMIS_UNDER_STATION')
  getOneLogicalMeterNMDetails(@Res() res: Response, @Param() params) {
    if (params.stationId && params.meterNMI) {
      this.stationsService
        .getOneMeterNMIDetails(params)
        .then((data) => {
          res.json({ meterNMIDetails: data });
        })
        .catch((error) => res.json({ meterNMIDetails: null, message: error }));
    } else {
       res.json({
         meterNMIDetails: null,
         message: 'Request data is not correct',
       });
    }
  }

  @Post('/inspectionreport')
  @UseInterceptors(
    FileInterceptor('selectedFile', {
      storage: diskStorage({
        destination: './inspectionreports',
        filename: (req, selectedFile, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(selectedFile.originalname)}`);
        },
      }),
    })
  )
  @Operations('ADD_ONE_INSPECTION_REPORT')
  postOneInspectionReport(
    @Res() res,
    @Body() body,
    @UploadedFile() selectedFile
  ) {
    if (body.stationId && body.reportNumber && body.inspectionDate) {
      this.stationsService
        .postOneInspectionReport(
          body.stationId,
          body.reportNumber,
          body.inspectionDate,
          selectedFile.path
        )
        .then((data) => {
          if (!data) {
            res.json({ data: null });
          } else {
            res.json({ data: data });
          }
        })
        .catch((error) => res.json({ data: null, message: error }));
    } else {
      res.json({ data: null, message: 'Post data is not correct' });
    }
  }
}