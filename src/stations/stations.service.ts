import { Injectable, NotFoundException } from '@nestjs/common';
import { pool } from '../dbConnection';

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

@Injectable()
export class StationsService {
  private stations: IStation[] = [];

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
}
