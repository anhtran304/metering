import { Injectable, NotFoundException } from '@nestjs/common';
import { pool } from '../dbConnection';
import sql = require('mssql');

export interface IStation {
  UserId: number;
  FirstName: string;
  LastName: string;
  FullName: string;
  Email: string;
  Password: string;
  Language: string;
  AvatarURL: string;
  DateTimeCreated: Date;
  isAtive: number;
}
export interface IStationDetail {
  UserId: number;
  FirstName: string;
  LastName: string;
  FullName: string;
  Email: string;
  Password: string;
  Language: string;
  AvatarURL: string;
  DateTimeCreated: Date;
  isAtive: number;
}

export interface ILogicalMeterNMIDetail {
  UserId: number;
  FirstName: string;
  LastName: string;
  FullName: string;
  Email: string;
  Password: string;
  Language: string;
  AvatarURL: string;
  DateTimeCreated: Date;
  isAtive: number;
}
export interface IPhysicalMeterNMIDetail {
  UserId: number;
  FirstName: string;
  LastName: string;
  FullName: string;
  Email: string;
  Password: string;
  Language: string;
  AvatarURL: string;
  DateTimeCreated: Date;
  isAtive: number;
}

@Injectable()
export class StationsService {
  private stations: IStation[] = [];
  private stationDetails: IStationDetail[] = [];
  private logicalMeterNMIDetails: ILogicalMeterNMIDetail[] = [];
  private physicalMeterNMIDetails: IPhysicalMeterNMIDetail[] = [];

  // Find all stations
  async findAllStations(): Promise<any> {
    this.stations = [];
    const data = await pool.request().execute('p_ViewAllStations');
    if (!data.recordset) {
      throw new NotFoundException();
    } else {
      this.stations = data.recordset;
      return this.stations;
    }
  }

  // Find one station details
  async getOneStationDetails(params): Promise<any> {
    this.stationDetails = [];
    const data = await pool
      .request()
      .input('stationId', sql.NVarChar(50), params.stationId)
      .execute('p_ViewStationDetail');
    if (!data.recordset) {
      throw new NotFoundException();
    } else if (data.recordset.length === 0) {
      return this.stationDetails;
    } else {
      this.stationDetails = data.recordset;
      return this.stationDetails;
    }
  }

  // Find one logical meter details
  async getOneMeterNMIDetails(params): Promise<any> {
    this.logicalMeterNMIDetails = [];
    this.physicalMeterNMIDetails = [];
    const dataLogical = await pool
      .request()
      .input('stationId', sql.NVarChar(50), params.stationId)
      .input('meterNMI', sql.NVarChar(100), params.meterNMI)
      .execute('p_ViewLogicalMeter');
    if (!dataLogical.recordset) {
      throw new NotFoundException();
    } else if (dataLogical.recordset.length === 0) {
      const dataPhysical = await pool
        .request()
        .input('stationId', sql.NVarChar(50), params.stationId)
        .input('meterNMI', sql.NVarChar(100), params.meterNMI)
        .execute('p_ViewPhysicalMeter');
      if (!dataPhysical.recordset) {
        throw new NotFoundException();
      } else if (dataPhysical.recordset.length === 0) {
        return {
          type: 'physical',
          meterNMIDetails: this.physicalMeterNMIDetails,
        };
      } else {
        this.physicalMeterNMIDetails = dataPhysical.recordset;
        return {
          type: 'physical',
          meterNMIDetails: this.physicalMeterNMIDetails,
        };
      }
    } else {
      this.logicalMeterNMIDetails = dataLogical.recordset;
        return {
          type: 'logical',
          meterNMIDetails: this.logicalMeterNMIDetails
        };
    }
  }
}

