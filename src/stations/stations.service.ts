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

@Injectable()
export class StationsService {
  private stations: IStation[] = [];
  private stationDetails: IStationDetail[] = [];
  private logicalMeterNMIDetails: ILogicalMeterNMIDetail[] = [];

  // Find all stations
  async findAllStations(): Promise<any> {
    const data = await pool
      .request()
      .execute('p_ViewAllStations');
    if (!data.recordset || data.recordset.length === 0) {
      throw new NotFoundException();
    } else {
      this.stations = data.recordset;
      return this.stations;
    }
  }

  // Find one station details
  async getOneStationDetails(params): Promise<any> {
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
  async getOneLogicalMeterNMIDetails(params): Promise<any> {
    const data = await pool
      .request()
      .input('stationId', sql.NVarChar(50), params.stationId)
      .input('meterNMI', sql.NVarChar(100), params.meterNMI)
      .execute('p_ViewLogicalMeter');
    if (!data.recordset) {
      throw new NotFoundException();
    } else if (data.recordset.length === 0) {
      return this.logicalMeterNMIDetails;
    } else {
      this.logicalMeterNMIDetails = data.recordset;
      return this.logicalMeterNMIDetails;
    }
  }
}

