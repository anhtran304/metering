import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StationsModule } from './stations/stations.module';
import { RolesModule } from './roles/roles.module';
import { PublicModule } from './public/public.module';

@Module({
  imports: [AuthModule, UsersModule, StationsModule, RolesModule, PublicModule],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
