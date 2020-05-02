import { Module } from '@nestjs/common';
// import { AppController } from './auth_test/auth.controller';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AppModule {}
