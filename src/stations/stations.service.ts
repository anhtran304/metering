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

@Injectable()
export class StationsService {
  private stations: IStation[] = [];
  private stationDetails: IStationDetail[] = [];

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

  // Find all stations
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
}
