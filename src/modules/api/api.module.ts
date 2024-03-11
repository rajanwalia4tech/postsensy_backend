import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [UsersModule],
  providers : [
    {
      provide : APP_INTERCEPTOR,
      useClass : ResponseInterceptor
    }
  ]
})
export class ApiModule {}
