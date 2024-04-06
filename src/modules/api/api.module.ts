import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { TokenModule } from './token/token.module';
import { GenerateModule } from './generate/generate.module';

@Module({
  imports: [UsersModule, AuthModule, TokenModule, GenerateModule],
  providers : [
    // {
    //   provide : APP_INTERCEPTOR,
    //   useClass : ResponseInterceptor
    // }
  ]
})
export class ApiModule {}
