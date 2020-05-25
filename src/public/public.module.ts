import { Module } from '@nestjs/common';
import { PublicController } from './public.controller';
import { StationsService } from '../stations/stations.service'

@Module({
  providers: [StationsService],
  controllers: [PublicController]
})
export class PublicModule {}
